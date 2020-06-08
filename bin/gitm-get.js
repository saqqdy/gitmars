#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { queue } = require('./src/index')
/**
 * gitm get
 */
program
	.name('gitm get')
	.usage('')
	.description('恢复暂存区最近一次暂存的文件')
	.action(() => {
		queue([{ cmd: 'git stash pop', config: { success: '文件恢复成功', fail: '恢复失败，请检查冲突' } }])
	})
program.parse(process.argv)
