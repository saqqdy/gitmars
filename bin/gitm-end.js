#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { warning, success, config, configFrom, queue, getStatus, pwd } = require('./index')
/**
 * gitm end
 */
program
	.name('gitm end')
	.usage('<type> <name>')
	.arguments('<type> <name>')
	.description('创建bugfix任务分支、创建feature功能开发分支')
	.action(async (type, name) => {
		const opts = ['bugfix', 'feature'] // 允许执行的指令
		let status = await getStatus()
		if (opts.includes(type) && status) {
			// feature从release拉取，bugfix从bug拉取
			let base = type === 'bugfix' ? config.bugfix : config.release,
				cmd = [`cd ${pwd}`, `git checkout ${base}`, `git pull`, `git merge --no-ff ${type}/${name}`, `git push`, `git branch -D ${type}/${name}`]
			queue(cmd)
				.then(data => {
					data.forEach((el, index) => {
						if (index === 3 || index === 4) {
							if (el.code === 0) {
								sh.echo(success(index === 3 ? '分支合并成功！' : '推送远程成功!'))
							} else {
								sh.echo(warning(el.out))
							}
						}
						if (el.code !== 0) {
							sh.echo(warning('指令' + cmd[index] + '执行失败，请联系管理员'))
						}
					})
				})
				.catch(err => {
					sh.echo(warning('指令 ' + err.cmd + ' 执行失败，请联系管理员'))
				})
		} else {
			sh.echo(warning('type只允许输入：' + opts.join(',')))
			sh.exit(1)
		}
	})
program.parse(process.argv)
