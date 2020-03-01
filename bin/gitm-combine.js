#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { warning, success, config, queue, getStatus, pwd } = require('./index')
/**
 * gitm combine
 */
program
	.name('gitm combine')
	.usage('<type> <name> [-d --dev] [-p --prod]')
	.arguments('<type> <name>')
	.description('合并bugfix任务分支、合并feature功能开发分支')
	.option('-d, --dev', '是否同步到alpha测试环境', false)
	.option('-p, --prod', '是否同步到预发布环境', false)
	.action(async (type, name, opt) => {
		const allow = ['bugfix', 'feature'] // 允许执行的指令
		let status = await getStatus()
		if (!opt.dev && !opt.prod) {
			sh.echo('请输入需要同步到的环境')
			sh.exit(1)
		}
		if (!status) sh.exit(1)
		if (allow.includes(type)) {
			// feature从release拉取，bugfix从bug拉取
			let base = type === 'bugfix' ? config.bugfix : config.release,
				cmd = [
					`git checkout ${config.develop}`,
					`git pull`,
					{
						cmd: `git merge --no-ff ${type}/${name}`,
						config: { slient: false, again: false, success: '分支合并成功', fail: '合并失败，请根据提示处理' }
					},
					{
						cmd: `git push`,
						config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
					},
					`git checkout ${type}/${name}`
				]
			if (opt.prod) {
				cmd = cmd.concat([
					`git checkout ${base}`,
					`git pull`,
					{
						cmd: `git merge --no-ff ${type}/${name}`,
						config: { slient: false, again: false, success: '分支合并成功', fail: '合并失败，请根据提示处理' }
					},
					{
						cmd: `git push`,
						config: { slient: false, again: false, success: '推送成功', fail: '推送失败，请根据提示处理' }
					},
					`git checkout ${type}/${name}`
				])
			}
			queue(cmd).then(data => {
				data.forEach((el, index) => {
					if (index === 2 || index === 3 || index === 7 || index === 8) {
						if (el.code === 0) {
							sh.echo(success(index === 3 || index === 8 ? '分支合并成功！' : '推送远程成功!'))
						} else {
							sh.echo(warning(el.out))
						}
					}
				})
			})
		} else {
			sh.echo(warning('type只允许输入：' + JSON.stringify(allow)))
			sh.exit(1)
		}
	})
program.parse(process.argv)
