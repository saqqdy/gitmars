#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { warning, success, config, configFrom, queue, pwd, getCache } = require('./index')
/**
 * gitm continue
 */
program
	.name('gitm continue')
	.usage('')
	.description('继续未完成的操作')
	.action(() => {
		let cmd = getCache()
		cmd.length > 0 && queue(cmd).then(data => {
			data.forEach((el, index) => {
				if (index = cmd.length - 1 && el.code === 0) {
					sh.echo(success('执行完毕'))
				}
			})
			.catch(err => {
				let msg = err.result[err.result.length - 1].err
				sh.echo(warning(msg))
				sh.echo(warning('指令 ' + err.cmd + ' 执行失败，中断了进程'))
				err.rest.length > 0 && sh.echo(warning('请处理相关问题之后输入gitm continue继续'))
			})
		})
	})
program.parse(process.argv)
