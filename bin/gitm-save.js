#!/usr/bin/env node
const program = require('commander')
const shell = require('shelljs')
const { warning, success, defaults, config, configFrom, wait, queue, pwd } = require('./index')
/**
 * gitm save
 */
program
	.name('gitm save')
	.usage('')
	.description('暂存当前分支文件')
	.option('-f, --force', '没有版本的文件也暂存，这会执行git add .', false)
	.action((opt) => {
		let cmd = [`cd ${pwd}`, 'git stash']
		if (opt.force) {
			cmd = [`cd ${pwd}`, 'git add .', 'git stash']
		}
		queue(cmd).then(data => {
			data.forEach((el, index) => {
				if (index === data.length - 1 && el.code === 0) {
					shell.echo(success('文件暂存成功！'))
				}
				if (el.code !== 0) {
					shell.echo(warning('指令' + cmd[index] + '执行失败，请联系管理员'))
				}
			})
		})
	})
program.parse(process.argv)
