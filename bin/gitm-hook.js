#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const execa = require('execa')
const { queue, success, getCurrent, getLogs, getStatusInfo, getStashList } = require('./js/index')
const config = require('./js/config')
const global = require('./js/global')
const { gitDir } = require('./js/global')
const ora = require('ora')
/**
 * gitm hook
 * gitm hook init
 * gitm hook test
 * gitm hook remove
 * gitm hook config
 */
program
	.name('gitm hook')
	.usage('[command]')
	.description('git hook钩子')
	.arguments('[command]')
	.option('--no-verify', '是否需要跳过校验权限', false)
	.option('-s, --since [since]', '查询在某个时间之后的日志，填写格式：10s/2m/2h/3d/4M/5y', '7d')
	.option('-l, --limit [limit]', '做多查询的日志条数', 20)
	.option('-b, --branches [branches]', '要查询的分支')
	.action(async (command, opt) => {
		/**
		 * 1. 是否合并过dev
		 * 2. 1周内是否同步过上游分支代码
		 * 3. 主干分支推送的内容是否是merge内容，暂时只检测最后一条记录
		 * 4.
		 */
		const current = getCurrent()
		const mainLogs = getLogs({
			since: opt.since,
			limit: opt.limit,
			branches: opt.branches
		})
		const currentLogs = getLogs({
			since: opt.since,
			limit: opt.limit,
			branches: 'wu'
		})
		const meagedDev = msg = sh.exec('git branch --contains feature/wu', { silent: true }).stdout
		let isUpdated = false,
			mainVers = [],
			currentVers = [],
			lastCommit = {
				isMerge: false,
				msg: '',
				author: 'saqqdy',
				date: ''
			}
		mainLogs.forEach(log => {
			mainVers.push(log['%H'])
		})
		currentLogs.forEach(log => {
			let arr = log['%P'] ? log['%P'].split(' ') : []
			arr.forEach(item => {
				currentVers.push(item)
			})
		})
		mainVer: for (let ver of mainVers) {
			if (currentVers.includes(ver)) {
				isUpdated = true
				break mainVer
			}
		}
		console.log(current, mainLogs, currentLogs, mainVers, currentVers)
		// console.log('gitm hook working!', config, global, gitDir)
		// console.log(getStatusInfo(), 99)
		// let allow = [config.master],
		// 	msg = sh.exec('git show', { silent: true }).stdout,
		// 	index
		// if (opt.dev) allow.push(config.develop)
		// if (opt.release) allow.push(config.release)
		// index = allow.indexOf(current)
		// if (index > -1 && !opt.noVerify && msg && msg.indexOf('Merge:') === -1 && msg.indexOf('Merge branch') === -1) {
		// 	sh.echo(error(`${allow[index]}分支不允许直接提交`))
		// 	sh.exit(1)
		// } else {
		// 	sh.exit(0)
		// }
		sh.exit(1)
	})
program.parse(process.argv)
