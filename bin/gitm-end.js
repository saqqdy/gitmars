#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { error, queue, getStatus } = require('../src/index')
const config = require('../src/config')
/**
 * gitm end
 */
program
	.name('gitm end')
	.usage('<type> <name>')
	.arguments('<type> <name>')
	.description('合并bugfix任务分支、合并feature功能开发分支，合并完成后将删除对应分支')
	.action(async (type, name, opt) => {
		const allow = ['bugfix', 'feature', 'support'] // 允许执行的指令
		let status = await getStatus()
		if (!status) sh.exit(1)
		if (allow.includes(type)) {
			let base = type === 'bugfix' ? config.bugfix : config.release,
				cmd = [
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
				]
			// support分支需要合到bugfix
			if (type === 'support') {
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
				`git branch -D ${type}/${name}`,
				`git checkout ${config.develop}`
			])
			queue(cmd)
		} else {
			sh.echo(error('type只允许输入：' + JSON.stringify(allow)))
			sh.exit(1)
		}
	})
program.parse(process.argv)
