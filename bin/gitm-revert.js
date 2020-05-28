#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { warning, queue } = require('../lib/index')
/**
 * gitm revert
 */
program
	.name('gitm revert')
	.usage('[commitid] [-n --number [number]] [-m --mode [mode]]')
	.arguments('[commitid]')
	.description('撤销一次提交记录')
	.option('-n, --number [number]', '撤销最后一次提交（或者撤销倒数第n次提交）', '')
	.option('-m, --mode [mode]', '针对撤销一次merge记录，需要传入类型：1 = 保留当前分支代码，2 = 保留传入代码', '')
	.action((commitid, opt) => {
		let cmd = [],
			n = 'HEAD',
			m = ''
		if (opt.mode) m = ' -m ' + Math.abs(Number(opt.mode))
		if (opt.number) {
			let num = Math.abs(Number(opt.number))
			if (num > 1) n += '~' + (num - 1)
			cmd.push({ cmd: `git revert ${n}${m}`, config: { slient: false, again: true, success: '撤销成功', fail: '出错了，请根据提示处理' } })
		} else if (commitid) {
			cmd.push({ cmd: `git revert ${commitid}${m}`, config: { slient: false, again: true, success: '撤销成功', fail: '出错了，请根据提示处理' } })
		} else {
			sh.echo(warning('指令不合法'))
			sh.exit(1)
		}
		queue(cmd)
	})
program.parse(process.argv)
