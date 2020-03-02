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
				cmd = [
					`git checkout ${base}`,
					`git pull`,
					`git checkout ${type}/${name}`,
					{
						cmd: `git rebase ${base}`,
						config: { slient: false, again: false, success: '分支合并成功', fail: '合并失败，请根据提示处理' }
					},
					{
						cmd: `git push`,
						config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
					}
				]
			queue(cmd).then(data => {
				data.forEach((el, index) => {
					if (index === 3 || index === 4) {
						if (el.code === 0) {
							sh.echo(success(index === 3 ? '分支更新成功！' : '推送远程成功!'))
						}
					}
				})
			})
		} else {
			sh.echo(warning('type只允许输入：' + JSON.stringify(opts)))
			sh.exit(1)
		}
	})
program.parse(process.argv)
