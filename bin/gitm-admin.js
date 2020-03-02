#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { warning, success, config, queue, getStatus, checkBranch } = require('./index')
/**
 * gitm admin create
 * gitm admin publish
 * gitm admin update
 */
program
	.name('gitm admin')
	.usage('<command> <type>')
	.command('create <type>')
	.description('创建bugfix、release、develop和support分支')
	.action(async type => {
		const opts = ['bugfix', 'release', 'develop', 'support'] // 允许执行的指令
		let base = type === 'release' ? config.master : config.release,
			status = await getStatus(),
			hasBase = await checkBranch(base),
			exits = await checkBranch(config[type])
		if (!status) sh.exit(1)
		if (!hasBase) {
			sh.echo(warning(base + '分支不存在，请先创建' + base + '分支'))
			sh.exit(1)
		}
		if (exits) {
			sh.echo(warning(config[type] + '分支已存在，不需要重复创建'))
			sh.exit(1)
		}
		if (opts.includes(type)) {
			// release从master拉取，其他从release拉取
			let cmd = [`git checkout -b ${config[type]} ${base}`]
			queue(cmd).then(data => {
				if (data[0].code === 0) {
					sh.echo(`${config[type]}分支创建成功，该分支基于${base}创建，您当前已经切换到${name}\n需要发版时，记得执行: ${success('gitm admin publish ' + type)}`)
				}
			})
		} else {
			sh.echo(warning('type只允许输入：' + opts.join(',')))
			sh.exit(1)
		}
	})
program
	.name('gitm admin')
	.usage('<command> <type>')
	.command('publish <type>')
	.description('发布bugfix、release、support分支')
	.action(async type => {
		const opts = ['bugfix', 'release', 'support'] // 允许执行的指令
		let status = await getStatus()
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
					`git checkout ${config.bugfix}`,
					`git pull`,
					`git checkout ${config.release}`,
					`git pull`,
					{
						cmd: `git merge --no-ff ${config.bugfix}`,
						config: { slient: false, again: false, success: '分支合并成功', fail: '合并失败，请根据提示处理' }
					},
					{
						cmd: `git push`,
						config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
					},
					`git checkout ${config.master}`,
					`git pull`,
					{
						cmd: `git merge --no-ff ${config.bugfix}`,
						config: { slient: false, again: false, success: '分支合并成功', fail: '合并失败，请根据提示处理' }
					},
					{
						cmd: `git push`,
						config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
					}
				],
				support: [
					`git checkout ${config.support}`,
					`git pull`,
					`git checkout ${config.release}`,
					`git pull`,
					{
						cmd: `git merge --no-ff ${config.support}`,
						config: { slient: false, again: false, success: '分支合并成功', fail: '合并失败，请根据提示处理' }
					},
					{
						cmd: `git push`,
						config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
					},
					`git checkout ${config.bugfix}`,
					`git pull`,
					{
						cmd: `git merge --no-ff ${config.support}`,
						config: { slient: false, again: false, success: '分支合并成功', fail: '合并失败，请根据提示处理' }
					},
					{
						cmd: `git push`,
						config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
					}
				],
				release: [
					`git checkout ${config.release}`,
					`git pull`,
					`git checkout ${config.master}`,
					`git pull`,
					{
						cmd: `git merge --no-ff ${config.release}`,
						config: { slient: false, again: false, success: '分支合并成功', fail: '合并失败，请根据提示处理' }
					},
					{
						cmd: `git push`,
						config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
					}
				]
			}
			queue(cmd[type]).then(data => {
				data.forEach((el, index) => {
					if (index === 4 || index === 5 || index === 8 || index === 9) {
						if (el.code === 0) {
							sh.echo(success(index === 4 || index === 8 ? '分支合并成功！' : '推送远程成功!'))
						}
					}
				})
			})
		} else {
			sh.echo(warning('type只允许输入：' + opts.join(',')))
			sh.exit(1)
		}
	})
program
	.name('gitm admin')
	.usage('<command> <type>')
	.command('update <type>')
	.description('更新bugfix、release、support分支代码')
	.action(async type => {
		const opts = ['bugfix', 'release', 'support'] // 允许执行的指令
		let base = type === 'release' ? config.master : config.release,
			status = await getStatus()
		if (!status) sh.exit(1)
		if (opts.includes(type)) {
			// release从master拉取，其他从release拉取
			let cmd = [
				`git checkout ${base}`,
				`git pull`,
				`git checkout ${config[type]}`,
				{
					cmd: `git pull origin ${config[type]} --rebase`,
					config: { slient: false, again: true }
				},
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
					if (index === 4 || index === 5) {
						if (el.code === 0) {
							sh.echo(success(index === 4 ? '分支合并成功！' : '推送远程成功!'))
						}
					}
				})
			})
		} else {
			sh.echo(warning('type只允许输入：' + opts.join(',')))
			sh.exit(1)
		}
	})
program.parse(process.argv)
