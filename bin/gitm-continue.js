#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { error, success, queue, getCache } = require('./index')
/**
 * gitm continue
 */
program
	.name('gitm continue')
	.usage('[-l --list]')
	.description('继续未完成的操作')
	.option('-l, --list', '显示指令队列', false)
	.action(opt => {
		let cmd = getCache()
		if (opt.list) {
			sh.echo(cmd)
			sh.exit(0)
		}
		if (cmd.length > 0) {
			queue(cmd)
		} else {
			sh.echo(error('队列里面没有未执行的指令'))
		}
	})
program.parse(process.argv)
