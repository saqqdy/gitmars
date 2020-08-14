#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { error, queue, getStatus, getCurrent, searchBranch } = require('./js/index')
const { defaults, appName } = require('./js/global')
const config = require('./js/config')
/**
 * gitm combine
 */
program
	.name('gitm combine')
	.usage('[type] [name] [-d --dev] [-p --prod]')
	.arguments('[type] [name]')
	.description('合并bugfix任务分支、合并feature功能开发分支、合并support分支')
	.option('-d, --dev', '是否同步到alpha测试环境', false)
	.option('-p, --prod', '是否同步到预发布环境', false)
	.option('-b, --build [build]', '需要构建的应用')
	.option('-m, --commit [commit]', 'commit信息', '')
	.option('-a, --add', '需要add', false)
	.option('--no-bugfix', '不同步到bug分支')
	.option('--as-feature', 'bug分支合并到release')
	.action(async (type, name, opt) => {
		const allow = ['bugfix', 'feature', 'support'] // 允许执行的指令
		const deny = [defaults.master, defaults.develop, defaults.release, defaults.bugfix, defaults.support]
		let status = !opt.add && opt.commit === '' ? getStatus() : true
		if (!opt.dev && !opt.prod) {
			sh.echo('请输入需要同步到的环境')
			sh.exit(1)
		}
		if (!status) sh.exit(1)
		if (opt.commit === true) {
			sh.echo(error(`请输入要提交的message`))
			sh.exit(1)
		}
		if (!type) {
			// type和name都没传且当前分支是开发分支
			;[type, name] = getCurrent().split('/')
			if (!name) {
				deny.includes(type) && sh.echo(error(`骚年，你在${type}分支执行这个指令是什么骚操作？`))
				sh.exit(1)
			}
		} else if (!name) {
			// 传了type没传name
			if (allow.includes(type)) {
				sh.echo('请输入分支名称')
				sh.exit(1)
			}
			let branchs = await searchBranch(type)
			if (branchs.length === 1) {
				;[type, name] = branchs[0].split('/')
			} else {
				sh.echo(branchs.length > 1 ? `查询到多条名称包含${type}的分支，请输入分支类型` : error('分支不存在，请正确输入'))
				sh.exit(1)
			}
		}
		if (allow.includes(type) && name) {
			let base = type === 'bugfix' ? config.bugfix : config.release,
				cmd = []
			if (opt.add) {
				cmd = cmd.concat([`git add .`])
			}
			if (opt.commit) {
				cmd = cmd.concat([`git commit -m "${opt.commit}"`])
			}
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
				if (opt.build) {
					cmd = cmd.concat([
						{
							cmd: `gitm build ${appName} --env dev --app ${opt.build === true ? 'all' : opt.build}`,
							config: { slient: true, again: false, success: '调起构建成功', fail: '调起构建失败' }
						}
					])
				}
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
				// bugfix分支走release发布
				if (type === 'bugfix' && opt.asFeature) {
					cmd = cmd.concat([
						`git fetch`,
						`git checkout ${config.release}`,
						`git pull`,
						{
							cmd: `git merge --no-ff ${type}/${name}`,
							config: { slient: false, again: false, success: `${type}/${name}合并到${config.release}成功`, fail: `${type}/${name}合并到${config.release}出错了，请根据提示处理` }
						},
						{
							cmd: `git push`,
							config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
						},
						`git checkout ${type}/${name}`
					])
				}
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
				// 仅支持构建bug
				if (opt.build) {
					if (type === 'bugfix') {
						cmd = cmd.concat([
							{
								cmd: `gitm build ${appName} --env bug --app ${opt.build === true ? 'all' : opt.build}`,
								config: { slient: true, again: false, success: '调起构建成功', fail: '调起构建失败' }
							}
						])
					}
					// support分支要构建bug和release
					if (type === 'support' && opt.bugfix) {
						cmd = cmd.concat([
							{
								cmd: `gitm build ${appName} --env bug --app ${opt.build === true ? 'all' : opt.build}`,
								config: { slient: true, again: false, success: '调起构建成功', fail: '调起构建失败' }
							}
						])
					}
				}
			}
			queue(cmd)
		} else {
			sh.echo(error('type只允许输入：' + JSON.stringify(allow)))
			sh.exit(1)
		}
	})
program.parse(process.argv)