#!/usr/bin/env node
const program = require('commander')
const shell = require('shelljs')
const { warning, success, defaults, config, configFrom, wait, queue, pwd } = require('./index')
/**
 * gitm admin start
 * gitm admin end
 */
program
	.name('gitm copy')
	.usage('[commitid...] [-w] [-a]')
	.arguments('[commitid...]')
	.description('cherry-pick易用版本')
	.option('-w, --grep [grep]', '模糊搜索commit信息关键词', '')
	.option('-a, --author [author]', '提交者', '')
	.action((commitid, opts) => {
		if (configFrom === 0) {
			shell.echo(warning('您还没有初始化项目\n请先执行: gitm init'))
			shell.exit(1)
		}
		if (opts.grep !== '' || opts.author !== '') {
			let cmd = [`cd ${pwd}`, `git log --grep=${opts.grep} --author=${opts.author}`]
			if (!/^\d{4,}$/.test(opts.grep)) {
				shell.echo(warning('为确保copy准确，关键词必须是4位以上的任务号'))
				shell.exit(1)
			}
			queue(cmd).then(data => {
				let commits = []
				if (data[1].code === 0) {
					let c = data[1].out.match(/(commit\s[a-z0-9]*\n+)/g) || []
					c.forEach(el => {
						commits.push(el.replace(/(commit\s)|\n/g, ''))
					})
					commits.length > 0 &&
						queue([`git cherry-pick ${commits.join(' ')}`]).then(data => {
							data.err && console.log(data.err)
						})
				} else {
					shell.echo(data[1].err)
				}
			})
		} else {
			let cmd = [`cd ${pwd}`, `git cherry-pick ${commitid.join(' ')}`]
			queue(cmd).then(data => {
				data[1].err && console.log(data[1].err)
			})
		}
	})
program.parse(process.argv)
