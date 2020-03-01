#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { warning, success, config, configFrom, queue, getStatus, pwd } = require('./index')
/**
 * gitm update
 */
program
	.name('gitm update')
	.usage('<type> <name>')
	.arguments('<type> <name>')
	.description('更新bug任务分支、更新feature功能开发分支')
	.action(async (type, name) => {
		const opts = ['bugfix', 'feature'] // 允许执行的指令
		let status = await getStatus()
		if (!status) sh.exit(1)
		if (opts.includes(type)) {
			// feature从release拉取，bugfix从bug拉取
			let base = type === 'bugfix' ? config.bugfix : config.release,
				cmd = [`cd ${pwd}`, `git checkout ${base}`, `git pull`, `git checkout ${type}/${name}``git rebase ${base}`]
			queue(cmd)
				.then(data => {
					data.forEach((el, index) => {
						if (index === 3 || index === 4) {
							if (el.code === 0) {
								sh.echo(success(index === 3 ? '分支更新成功！' : '推送远程成功!'))
							} else {
								sh.echo(warning(el.out))
							}
						}
						// if (el.code !== 0) {
						// 	sh.echo(warning('指令' + cmd[index] + '执行失败，请联系管理员'))
						// }
					})
				})
				.catch(err => {
					let last = err.result.pop()
					if (cmd.length - err.rest.length === 5) {
						// 执行到merge的时候中断
						sh.echo('合并过程出现了文件冲突\n' + warning(last.out))
						err.rest.length > 0 && sh.echo('\n请解决冲突后吧文件加入暂存区，并继续执行以下指令：\n    ' + success(err.rest.join('\n    ')))
					}
				})
		} else {
			sh.echo(warning('type只允许输入：' + JSON.stringify(opts)))
			sh.exit(1)
		}
	})
program.parse(process.argv)
