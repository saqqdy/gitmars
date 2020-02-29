#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { warning, success, config, configFrom, queue, pwd } = require('./index')
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
				sh.echo(success('文件恢复成功！'))
			} else {
				sh.echo(warning(data.err))
			}
		})
	})
program.parse(process.argv)
