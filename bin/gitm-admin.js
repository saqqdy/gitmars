#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { error, success, queue, getStatus, checkBranch, getCurrent } = require('./js/index')
const { appName } = require('./js/global')
const config = require('./js/config')
/**
 * gitm admin create
 * gitm admin publish
 * gitm admin update
 * gitm admin clean
 */
program
	.name('gitm admin')
	.usage('<command> <type>')
	.command('create <type>')
	.description('创建bugfix、release、develop和support分支')
	.action(async type => {
		const opts = ['bugfix', 'release', 'develop', 'support'] // 允许执行的指令
		let base = type === 'release' ? config.master : config.release,
			status = getStatus(),
			hasBase = await checkBranch(base),
			exits = await checkBranch(config[type])
		if (!status) sh.exit(1)
		if (!hasBase) {
			sh.echo(error(base + '分支不存在，请先创建' + base + '分支'))
			sh.exit(1)
		}
		if (exits) {
			sh.echo(error(config[type] + '分支已存在，不需要重复创建'))
			sh.exit(1)
		}
		if (opts.includes(type)) {
			// release从master拉取，其他从release拉取
			let cmd = [`git fetch`, `git checkout ${base}`, `git pull`, `git checkout -b ${config[type]} ${base}`]
			queue(cmd).then(data => {
				if (data[3].code === 0) {
					sh.echo(`${config[type]}分支创建成功，该分支基于${base}创建，您当前已经切换到${name}\n需要发版时，记得执行: ${success('gitm admin publish ' + type)}`)
				}
			})
		} else {
			sh.echo(error('type只允许输入：' + opts.join(',')))
			sh.exit(1)
		}
	})
program
	.name('gitm admin')
	.usage('<command> <type>')
	.command('publish <type>')
	.description('发布bugfix、release、support分支')
	.option('-c, --combine', '是否把release代码同步到bug', false)
	.option('--use-rebase', '是否使用rebase方式更新，默认merge', false)
	.option('-p, --prod', '发布bug分支时，是否合并bug到master', false)
	.option('-b, --build [build]', '需要构建的应用')
	.option('--postmsg', '发送消息', false)
	.action(async (type, opt) => {
		const opts = ['bugfix', 'release', 'support'] // 允许执行的指令
		let status = getStatus(),
			curBranch = await getCurrent()
		if (!status) sh.exit(1)
		if (opts.includes(type)) {
			/**
			 * bugfix -> master/release
			 * release -> master
			 * develop -> null
			 * support -> bugfix/release
			 */
			let cmd = {
				bugfix: [
					`git fetch`,
					`git checkout ${config.bugfix}`,
					`git pull`,
					`git checkout ${config.release}`,
					`git pull`,
					{
						cmd: `git merge --no-ff ${config.bugfix}`,
						config: { slient: false, again: false, postmsg: opt.postmsg, success: `${config.bugfix}合并到${config.release}成功`, fail: `${config.bugfix}合并到${config.release}出错了，请根据提示处理` }
					},
					{
						cmd: `git push`,
						config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
					}
				],
				support: [
					`git fetch`,
					`git checkout ${config.support}`,
					`git pull`,
					`git checkout ${config.release}`,
					`git pull`,
					{
						cmd: `git merge --no-ff ${config.support}`,
						config: { slient: false, again: false, success: `${config.support}合并到${config.release}成功`, fail: `${config.support}合并到${config.release}出错了，请根据提示处理` }
					},
					{
						cmd: `git push`,
						config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
					},
					`git checkout ${config.bugfix}`,
					`git pull`,
					{
						cmd: `git merge --no-ff ${config.support}`,
						config: { slient: false, again: false, success: `${config.support}合并到${config.bugfix}成功`, fail: `${config.support}合并到${config.bugfix}出错了，请根据提示处理` }
					},
					{
						cmd: `git push`,
						config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
					}
				],
				release: [
					`git fetch`,
					`git checkout ${config.release}`,
					`git pull`,
					`git checkout ${config.master}`,
					`git pull`,
					{
						cmd: `git merge --no-ff ${config.release}`,
						config: { slient: false, again: false, success: `${config.release}合并到${config.master}成功`, fail: `${config.release}合并到${config.master}出错了，请根据提示处理` }
					},
					{
						cmd: `git push`,
						config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
					}
				]
			}
			// 发布bug分支且同步到master
			if (type === 'bugfix' && opt.prod) {
				cmd[type] = cmd[type].concat([
					`git checkout ${config.master}`,
					`git pull`,
					{
						cmd: `git merge --no-ff ${config.bugfix}`,
						config: { slient: false, again: false, success: `${config.bugfix}合并到${config.master}成功`, fail: `${config.bugfix}合并到${config.master}出错了，请根据提示处理` }
					},
					{
						cmd: `git push`,
						config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
					}
				])
				if (opt.build) {
					cmd[type] = cmd[type].concat([
						{
							cmd: `gitm build ${appName} --env bug --app ${opt.build === true ? 'all' : opt.build}`,
							config: { slient: true, again: false, success: '调起构建成功', fail: '调起构建失败' }
						}
					])
				}
			}
			// 发布release
			if (type === 'release' && opt.build) {
				cmd[type] = cmd[type].concat([
					{
						cmd: `gitm build ${appName} --env prod --app ${opt.build === true ? 'all' : opt.build}`,
						config: { slient: true, again: false, success: '调起构建成功', fail: '调起构建失败' }
					}
				])
			}
			// 发布release分支且同步release代码到bug线
			if (type === 'release' && opt.combine) {
				// 使用rebase
				if (opt.useRebase) {
					cmd[type] = cmd[type].concat([
						`git checkout ${config.release}`,
						`git pull`,
						`git checkout ${config.bugfix}`,
						{
							cmd: `git pull origin ${config.bugfix} --rebase`,
							config: { slient: false, again: true }
						},
						{
							cmd: `git rebase ${config.release}`,
							config: { slient: false, again: false, postmsg: opt.postmsg, success: `${config.release}同步到${config.bugfix}成功`, fail: `${config.release}同步到${config.bugfix}出错了，请根据提示处理` }
						},
						{
							cmd: `git push`,
							config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
						}
					])
				} else {
					cmd[type] = cmd[type].concat([
						`git checkout ${config.release}`,
						`git pull`,
						`git checkout ${config.bugfix}`,
						`git pull`,
						{
							cmd: `git merge --no-ff ${config.release}`,
							config: { slient: false, again: false, postmsg: opt.postmsg, success: `${config.release}合并到${config.bugfix}成功`, fail: `${config.release}合并到${config.bugfix}出错了，请根据提示处理` }
						},
						{
							cmd: `git push`,
							config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
						}
					])
				}
			}
			// 回到当前分支
			for (let key in cmd) {
				cmd[key].push(`git checkout ${curBranch}`)
			}
			queue(cmd[type])
		} else {
			sh.echo(error('type只允许输入：' + opts.join(',')))
			sh.exit(1)
		}
	})
program
	.name('gitm admin')
	.usage('<command> <type> [-m --mode [mode]]')
	.command('update <type>')
	.description('更新bugfix、release、support分支代码')
	.option('--use-rebase', '是否使用rebase方式更新，默认merge', false)
	.option('-m, --mode [mode]', '出现冲突时，保留传入代码还是保留当前代码；1=采用当前 2=采用传入；默认为 0=手动处理。本参数不可与--use-rebase同时使用', 0)
	.option('--postmsg', '发送消息', false)
	.action((type, opt) => {
		const opts = ['bugfix', 'release', 'support'] // 允许执行的指令
		let base = type === 'release' ? config.master : config.release,
			mode = '', // 冲突时，保留哪方代码
			status = getStatus()
		if (!status) sh.exit(1)
		if (opt.mode === 1) {
			mode = ' --strategy-option ours'
		} else if (opt.mode === 2) {
			mode = ' --strategy-option theirs'
		}
		if (opts.includes(type)) {
			let cmd = [
				`git fetch`,
				`git checkout ${base}`,
				`git pull`,
				`git checkout ${config[type]}`,
				{
					cmd: `git pull`,
					config: { slient: false, again: true }
				},
				{
					cmd: `git merge --no-ff ${base}${mode}`,
					config: { slient: false, again: false, postmsg: opt.postmsg, success: `${base}同步到${config[type]}成功`, fail: `${base}同步到${config[type]}出错了，请根据提示处理` }
				},
				{
					cmd: `git push`,
					config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
				}
			]
			if (opt.useRebase) {
				cmd = [
					`git fetch`,
					`git checkout ${base}`,
					`git pull`,
					`git checkout ${config[type]}`,
					{
						cmd: `git pull origin ${config[type]} --rebase`,
						config: { slient: false, again: true }
					},
					{
						cmd: `git rebase ${base}`,
						config: { slient: false, again: false, postmsg: opt.postmsg, success: `${base}同步到${config[type]}成功`, fail: `${base}同步到${config[type]}出错了，请根据提示处理` }
					},
					{
						cmd: `git push`,
						config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
					}
				]
			}
			queue(cmd)
		} else {
			sh.echo(error('type只允许输入：' + opts.join(',')))
			sh.exit(1)
		}
	})
program
	.name('gitm admin')
	.usage('<command> <type>')
	.command('clean <type>')
	.description('构建清理工作')
	.action(type => {
		const opts = ['bugfix', 'release', 'develop', 'master'] // 允许执行的指令
		let status = getStatus()
		if (!status) sh.exit(1)
		if (opts.includes(type)) {
			let cmd = [`git fetch`, `git checkout . -f`, `git clean -fd`, `git checkout ${config.master}`, `git branch -D ${config[type]}`, `git fetch`, `git checkout ${config[type]}`, `git pull`]
			if (type === 'master') cmd = [`git checkout .`, `git clean -fd`, `git checkout ${config.master}`, `git clean -fd`, `git fetch`, `git pull`]
			queue(cmd)
		} else {
			sh.echo(error('type只允许输入：' + opts.join(',')))
			sh.exit(1)
		}
	})
program.parse(process.argv)
