#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { error, success, config, queue, getStatus, pwd } = require('./index')
/**
 * gitm combine
 */
program
	.name('gitm combine')
	.usage('<type> <name> [-d --dev] [-p --prod]')
	.arguments('<type> <name>')
	.description('合并bugfix任务分支、合并feature功能开发分支、合并support分支')
	.option('-d, --dev', '是否同步到alpha测试环境', false)
	.option('-p, --prod', '是否同步到预发布环境', false)
	.option('--no-bugfix', '不同步到bug分支')
	.action(async (type, name, opt) => {
		const allow = ['bugfix', 'feature', 'support'] // 允许执行的指令
		let status = await getStatus()
		if (!opt.dev && !opt.prod) {
			sh.echo('请输入需要同步到的环境')
			sh.exit(1)
		}
		if (!status) sh.exit(1)
		if (allow.includes(type)) {
			let base = type === 'bugfix' ? config.bugfix : config.release,
				cmd = []
			if (opt.dev) {
				cmd = cmd.concat([
					`git fetch`,
					`git checkout ${config.develop}`,
					`git pull`,
					{
						cmd: `git merge --no-ff ${type}/${name}`,
						config: { slient: false, again: false, success: `${type}/${name}合并到${config.develop}成功`, fail: `${type}/${name}合并到${config.develop}出错了，请根据提示处理` }
					},
					{
						cmd: `git push`,
						config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
					},
					`git checkout ${type}/${name}`
				])
			}
			if (opt.prod) {
				cmd = cmd.concat([
					`git fetch`,
					`git checkout ${base}`,
					`git pull`,
					{
						cmd: `git merge --no-ff ${type}/${name}`,
						config: { slient: false, again: false, success: `${type}/${name}合并到${base}成功`, fail: `${type}/${name}合并到${base}出错了，请根据提示处理` }
					},
					{
						cmd: `git push`,
						config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
					},
					`git checkout ${type}/${name}`
				])
				// support分支需要合到bugfix
				if (type === 'support' && opt.bugfix) {
					cmd = cmd.concat([
						`git fetch`,
						`git checkout ${config.bugfix}`,
						`git pull`,
						{
							cmd: `git merge --no-ff ${type}/${name}`,
							config: { slient: false, again: false, success: `${type}/${name}合并到${config.bugfix}成功`, fail: `${type}/${name}合并到${config.bugfix}出错了，请根据提示处理` }
						},
						{
							cmd: `git push`,
							config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
						},
						`git checkout ${type}/${name}`
					])
				}
			}
			queue(cmd)
		} else {
			sh.echo(error('type只允许输入：' + JSON.stringify(allow)))
			sh.exit(1)
		}
	})
program.parse(process.argv)
