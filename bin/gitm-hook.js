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
	.option('-l, --limit [limit]', '最多查询的日志条数')
	.option('-b, --branches [branches]', '要查询的分支')
	.action(async (command, opt) => {
		/**
		 * 1. 是否合并过dev post-merge
		 * 2. 1周内是否同步过上游分支代码
		 * 3. 主干分支推送的内容是否是merge内容，暂时只检测最后一条记录
		 * 4.
		 */
		const current = getCurrent()
		let lastCommit = {
			isMerge: false,
			msg: '',
			author: 'saqqdy',
			date: ''
		}
		// 1. 获取是否合并过dev
		const getIsMergedBranch = (branch = 'dev') => {
			const result = sh.exec(`git branch --contains ${current}`, { silent: true }).stdout.replace(/[\n\s]*$/g, '')
			return result.split('\n').includes(branch)
		}
		// 2. 获取一周内是否同步过上游分支代码
		const getIsUpdatedInTime = () => {
			let isUpdated = false,
				mainVers = [],
				currentVers = []
			const mainLogs = getLogs({
				since: opt.since,
				limit: opt.limit,
				branches: opt.branches
			})
			const currentLogs = getLogs({
				since: opt.since,
				limit: opt.limit,
				branches: current
			})
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
			// console.log(current, mainLogs, currentLogs)
			console.log(mainVers, currentVers)
			return isUpdated
		}
		// 3. 获取主干分支推送的内容是否是merge内容，暂时只检测最后一条记录
		const getIsMergeAction = () => {
			const currentLogs = getLogs({
				limit: 1,
				branches: current
			})
			let p = currentLogs[0]['%P'] ? currentLogs[0]['%P'].split(' ') : []
			// console.log(currentLogs)
			return p.length > 1
		}
		// 4. 获取当前本地分支与远程分支的差别
		const getIsNeedPull = () => {
			sh.exec(`git fetch`, { silent: true })
			const result = sh.exec(`git log ${current}..origin/${current}`, { silent: true }).stdout.replace(/[\n\s]*$/g, '')
			return !!result
		}
		console.log('1. 当前分支是否合并过dev', getIsMergedBranch())
		console.log('2. 一周内是否同步过上游分支代码', getIsUpdatedInTime())
		console.log('3. 最后一条记录是否merge记录', getIsMergeAction())
		console.log('4. 是否需要pull代码', getIsNeedPull())
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
