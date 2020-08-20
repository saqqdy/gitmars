#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { options, args } = require('./conf/continue')
const { error, queue, getCache, createArgs } = require('./js/index')
/**
 * gitm continue
 */
program.name('gitm continue').usage('[-l --list]').description('继续未完成的操作')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach(o => {
	program.option(o.flags, o.description, o.defaultValue)
})
// .option('-l, --list', '显示指令队列', false)
program.action(opt => {
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
