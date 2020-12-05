#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { queue, success, getLogs } = require('./js/index')
const config = require('./js/config')
const global = require('./js/global')
const { gitDir } = require('./js/global')
const ora = require('ora')
/**
 * gitm log
 */
program
	.name('gitm log')
	.usage('[version]')
	.description('日志查询')
	.arguments('[version]')
	.option('-s, --since [since]', '查询在某个时间之后的日志，填写格式：10s/2m/2h/3d/4M/5y', '7d')
	.option('-l, --limit [limit]', '做多查询的日志条数', 20)
	.option('-b, --branches [branches]', '要查询的分支')
	.action(async (version, opt) => {
		const mainLogs = getLogs({
			since: opt.since,
			limit: opt.limit,
			branches: opt.branches
		})
		console.log(mainLogs)
		sh.exit(1)
	})
program.parse(process.argv)
