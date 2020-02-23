#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { warning, success, defaults, config, configFrom, wait, queue, pwd } = require('./index')
/**
 * gitm admin start
 * gitm admin end
 */
program
	.name('gitm admin')
	.usage('<command> <type> <name>')
	.command('start <type> <name>')
	.description('对发版分支bugfix、release的操作')
	.action((type, name) => {
		if (configFrom === 0) {
			sh.echo(warning('您还没有初始化项目\n请先执行: gitm init'))
			sh.exit(1)
		}
		if (['bugfix', 'release', 'support', 'feature'].includes(type)) {
			// feature从dev拉取，其他从master拉取
			let base = type === 'feature' ? config.develop : config.master,
				cmd = [`cd ${pwd}`, `git checkout -b ${type}/${name} ${base}`]
			queue(cmd).then(data => {
				if (data[1].code === 0) {
					sh.echo(`${name}分支创建成功，该分支基于${base}创建，您当前已经切换到${type}/${name}\n开发完成后，记得执行: ${success('gitm admin end ' + type + ' ' + name)}`)
				} else {
					sh.echo(data[1].err, data[1].code)
				}
			})
		}
	})
program
	.name('gitm admin')
	.usage('<command> <type> <name>')
	.command('end <type> <name>')
	.description('对发版分支bugfix、release的操作')
	.action((type, name) => {
		if (configFrom === 0) {
			sh.echo(warning('您还没有初始化项目\n请先执行: gitm init'))
			sh.exit(1)
		}
		if (['bugfix', 'release', 'support'].includes(type)) {
			// feature从dev拉取，其他从master拉取
			let cmd = [`cd ${pwd}`, `git checkout ${config.master} && git merge --no-ff ${type}/${name} && git push`]
			if (type === 'bugfix') {
				cmd.push(`git checkout ${config.release} && git merge --no-ff ${type}/${name} && git push`)
			} else if (type === 'support') {
				cmd.push(`git checkout ${config.release} && git merge --no-ff ${type}/${name} && git push`)
				cmd.push(`git checkout ${config.bugfix} && git merge --no-ff ${type}/${name} && git push`)
			}
			cmd.push(`git branch -D ${type}/${name}`)
			queue(cmd).then(data => {
				if (data[1].code === 0) {
					sh.echo(`${name}分支已合并，tag已打`)
				} else {
					sh.echo(data[1].err, data[1].code)
				}
			})
		} else {
			// type === feature
		}
	})
program.parse(process.argv)
