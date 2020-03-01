#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { warning, success, config, configFrom, queue, getStatus, pwd } = require('./index')
/**
 * gitm combine
 */
program
	.name('gitm combine')
	.usage('<type> <name>')
	.arguments('<type> <name>')
	.description('合并bugfix任务分支、合并feature功能开发分支')
	.option('-d, --dev', '是否同步到alpha测试环境', true)
	.option('-p, --prod', '是否同步到预发布环境', false)
	.action(async (type, name, opt) => {
		const allow = ['bugfix', 'feature'] // 允许执行的指令
		let status = await getStatus()
		if (!status) sh.exit(1)
		if (allow.includes(type)) {
			// feature从release拉取，bugfix从bug拉取
			let base = type === 'bugfix' ? config.bugfix : config.release,
				cmd = [
					`git checkout ${config.develop}`,
					`git pull`,
					{
						cmd: `git merge --no-ff ${type}/${name}`,
						config: { slient: false }
					},
					{
						cmd: `git push`,
						config: { slient: false }
					},
					`git checkout ${type}/${name}`
				]
			if (opt.prod) {
				cmd = cmd.concat([
					`git checkout ${base}`,
					`git pull`,
					{
						cmd: `git merge --no-ff ${type}/${name}`,
						config: { slient: false }
					},
					{
						cmd: `git push`,
						config: { slient: false }
					},
					`git checkout ${type}/${name}`
				])
			}
			queue(cmd).then(data => {
				data.forEach((el, index) => {
					if (index === 2 || index === 3) {
						if (el.code === 0) {
							sh.echo(success(index === 3 ? '分支合并成功！' : '推送远程成功!'))
						} else {
							sh.echo(warning(el.out))
						}
					}
					// if (el.code !== 0) {
					// 	sh.echo(warning('指令' + cmd[index] + '执行失败，请联系管理员'))
					// }
				})
			})
		} else {
			sh.echo(warning('type只允许输入：' + JSON.stringify(allow)))
			sh.exit(1)
		}
	})
program.parse(process.argv)
