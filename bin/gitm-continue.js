#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { warning, success, queue, getCache } = require('./index')
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
				.then(data => {
					data.forEach((el, index) => {
						if (el.code === 0) {
							let c = typeof cmd[index] !== 'string' ? cmd[index].cmd : cmd[index]
							sh.echo(success('指令 ' + c + ' 执行完毕'))
							sh.exit(0)
						}
					})
				})
				.catch(err => {
					let msg = err.result[err.result.length - 1].err
					sh.echo(warning(msg))
					sh.echo(warning('指令 ' + err.cmd + ' 执行失败，中断了进程'))
					err.rest.length > 0 && sh.echo(warning('请处理相关问题之后输入gitm continue继续'))
				})
		} else {
			sh.echo(warning('队列里面没有未执行的指令'))
		}
	})
program.parse(process.argv)
