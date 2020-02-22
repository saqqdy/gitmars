#!/usr/bin/env node
const program = require('commander')
const shell = require('shelljs')
const { warning, success, defaults, config, configFrom, wait, queue, pwd } = require('./index')
/**
 * gitm get
 */
program
	.name('gitm get')
	.usage('')
	.description('恢复暂存区最近一次暂存的文件')
	.action(() => {
		queue(['git stash pop']).then(data => {
			if (data.code === 0) {
				shell.echo(success('文件恢复成功！'))
			} else {
				shell.echo(warning(data.err))
			}
		})
	})
program.parse(process.argv)
