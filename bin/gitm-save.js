#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { queue, getCurrent } = require('./js/index')
/**
 * gitm save
 */
program
	.name('gitm save')
	.usage('[message]')
	.arguments('[message]')
	.description('暂存当前分支文件')
	.option('-f, --force', '没有版本的文件也暂存，这会执行git add .', false)
	.action((message, opt) => {
		if (!message) message = getCurrent()
		let cmd = [{ cmd: `git stash save "${message}"`, config: { success: '文件暂存成功', fail: '出错了，请联系管理员' } }]
		if (opt.force) {
			cmd = ['git add .', { cmd: `git stash save "${message}"`, config: { success: '文件暂存成功', fail: '出错了，请联系管理员' } }]
		}
		queue(cmd)
	})
program.parse(process.argv)
