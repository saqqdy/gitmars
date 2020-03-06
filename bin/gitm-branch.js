#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { error, success, config, configFrom, queue, pwd } = require('./index')
/**
 * gitm branch
 */
program
	.name('gitm branch')
	.usage('[-k --key [keyword]] [-t --type [type]] [-d --delete [branch]] [-r --remote [remote]] [-D --forcedelete [branch]]')
	.description('分支查询、删除（注意该指令不用于创建分支，如需创建分支请走start流程）')
	.option('-k, --key [keyword]', '查询分支的关键词', null)
	.option('-r, --remote', '是否查询远程分支（这个参数不用于删除分支）默认只查询本地', false)
	.option('-t, --type [type]', '查询分支的类型，共有3种：feature、bugfix、support，不传则查询全部', null)
	.option('-d, --delete [branch]', '删除分支', null)
	.option('-D, --forcedelete [branch]', '强行删除分支', null)
	.action(opt => {
		let cmd = [`cd ${pwd}`]
		if (opt.delete) {
			// 删除分支
			cmd.push(`git branch -d ${opt.delete}`)
		} else if (opt.forcedelete) {
			// 强行删除分支
			cmd.push(`git branch -D ${opt.forcedelete}`)
		} else {
			// 分支查询
			cmd.push(`git branch -a`)
			queue(cmd).then(data => {
				data.forEach((el, index) => {
					if (index === 1 && el.code === 0) {
						let list = el.out.split('\n')
						list = list.filter(el => {
							let fit = true
							if (opt.key) {
								fit = fit && el.indexOf(opt.key) > -1
							}
							if (opt.type) {
								fit = fit && el.indexOf(opt.type) > -1
							}
							if (opt.remote) {
								fit = fit && el.indexOf('remotes/origin') > -1
							} else {
								fit = fit && el.indexOf('remotes/origin') === -1
							}
							return fit
						})
						sh.echo(list.join('\n'))
					}
				})
			})
			return
		}
		queue(cmd)
	})
program.parse(process.argv)
