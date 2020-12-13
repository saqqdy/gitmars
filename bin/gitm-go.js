#!/usr/bin/env node
const program = require('commander')
const fs = require('fs')
const sh = require('shelljs')
const { options, args } = require('./conf/build')
const { queue, success, warning, getCurrent, getLogs, compareVersion } = require('./js/index')
const getConfig = require('./js/getConfig')
const global = require('./js/global')
const { pwd, gitDir, gitHookDir } = require('./js/global')

/**
 * gitm go
 */
program
	.name('gitm go')
	.usage('[command]')
	.description('智能猜测你要执行的动作')
	.arguments('[command]')
	// .option('--no-verify', '是否需要跳过校验权限', false)
	// .option('-s, --since [since]', '查询在某个时间之后的日志，填写格式：10s/2m/2h/3d/4M/5y', '7d')
	// .option('-l, --limit [limit]', '最多查询的日志条数')
	// .option('-b, --branches [branches]', '要查询的分支')
	.action(async (command, opt) => {
		const config = getConfig()
		const mainBranchs = [config.master, config.develop, config.release, config.support, config.bugfix]
		const current = getCurrent()
		const branchPrefix = current.split('/')[0]
		if (mainBranchs.includes(current)) {
			// 主干分支
		} else if (branchPrefix === 'feature') {
			// feature
		} else if (branchPrefix === 'bugfix') {
			// bugfix
		} else if (branchPrefix === 'support') {
			// support
		}
		sh.echo(success(`当前分支${current}`))
		console.log(branchPrefix)
	})
program.parse(process.argv)
