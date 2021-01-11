#!/usr/bin/env node
const program = require('commander')
const fs = require('fs')
const sh = require('shelljs')
const { options, args } = require('./conf/hook')
const { queue, success, warning, error, createArgs, getCurrent, getLogs, compareVersion } = require('./js/index')
const { createHooks, removeHooks, createHookShell, removeHookShell, createLocalShell, removeLocalShell } = require('./js/hook')
const gitRevParse = require('./js/gitRevParse')
const config = require('./js/getConfig')()
const { pwd, gitDir, gitHookDir } = require('./js/global')
const ora = require('ora')
const ciInfo = require('ci-info')

/**
 * gitm hook
 * gitm hook init
 * gitm hook remove
 * gitm hook config
 */
program.name('gitm hook').usage('[command]').description('git hook钩子')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach(o => {
	program.option(o.flags, o.description, o.defaultValue)
})
// .arguments('[command] [args...]')
// .option('--no-verify', '是否需要跳过校验权限', false)
// .option('--latest [latest]', '查询在某个时间之后的日志，填写格式：10s/2m/2h/3d/4M/5y', '7d')
// .option('--limit [limit]', '最多查询的日志条数')
// .option('-t, --type <type>', '检测类型')
// .option('--branch [branch]', '要查询的分支')
program.action(async (command, args, opt) => {
	console.log(80808080, command, args, opt.latest, opt.type)
	const current = getCurrent()
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
			latest: opt.latest,
			limit: opt.limit,
			branches: opt.branch
		})
		const currentLogs = getLogs({
			latest: opt.latest,
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
	// 获取当前本地分支落后远程的日志
	const getBehandLogs = () => {
		sh.exec(`git fetch`, { silent: true })
		const result = sh.exec(`git log ${current}..origin/${current} --pretty=format:"%p"`, { silent: true }).stdout.replace(/[\s]*$/g, '')
		return result ? result.split('\n') : []
	}
	// 获取当前本地分支领先远程的日志
	const getAheadLogs = () => {
		sh.exec(`git fetch`, { silent: true })
		const result = sh.exec(`git log origin/${current}..${current} --pretty=format:"%p"`, { silent: true }).stdout.replace(/[\s]*$/g, '')
		return result ? result.split('\n') : []
	}
	// 获取git版本
	const getGitVersion = () => {
		let version = sh
			.exec('git --version', { silent: true })
			.stdout.replace(/\s*$/g, '')
			.match(/[\d.?]+/g)
		if (!version) {
			sh.echo(warning('没有找到git'))
			sh.exit(1)
			return
		}
		version = version[0]
		return version
	}

	// 不检测直接返回
	if (opt.noVerify) {
		sh.exit(0)
		return
	}

	if (command === 'init') {
		// 初始化钩子
		const gitVersion = getGitVersion()
		const gitVersionIsNew = compareVersion(gitVersion, '2.13.0')
		const { prefix } = gitRevParse()
		// 集成环境不安装
		if (ciInfo.isCI && config.skipCI) {
			console.log('持续集成环境，跳过钩子安装')
			return
		}
		// 如果没有hooks文件夹，创建
		if (!fs.existsSync(gitHookDir)) {
			fs.mkdirSync(gitHookDir)
		}
		if (['1', 'true'].includes(process.env.GITMARS_SKIP_HOOKS || '')) {
			sh.echo(warning('已存在环境变量GITMARS_SKIP_HOOKS，跳过安装'))
			process.exit(0)
		}
		// git版本过旧
		if (!gitVersionIsNew) {
			sh.echo(warning('Gitmars需要使用2.13.0以上版本的Git，当前版本：' + gitVersion))
			process.exit(0)
		}
		createHooks(gitHookDir)
		createHookShell(gitHookDir)
		createLocalShell(gitHookDir, 'yarn', prefix)
	} else if (command === 'remove') {
		// 移除钩子
		removeHooks()
		removeHookShell()
		removeLocalShell()
	} else {
		// 检测权限 command = hookName
		// 检测类型对应上面的检测方法
		if (opt.type === 1) {
			// 分支合并主干分支之后，检测该分支是否合并过dev，没有合并过的，不允许继续执行commit
		} else if (opt.type === 2) {
			// 分支合并主干分支之后，检测该分支是否同步过上游分支的代码，没有同步过的，不允许继续执行commit
		} else if (opt.type === 3) {
			// 在主干分支执行push推送时，检测最后一次提交是否为merge记录，如果不是，提示不允许直接在主干分支做修改
			const behandLogs = getBehandLogs()
			const aheadLogs = getAheadLogs()
			let isMerge = true
			aheadLog: for (let logStr of aheadLogs) {
				let logs = logStr.split(' ')
				if (logs.length < 2) {
					isMerge = false
					break aheadLog
				}
			}
			if (isMerge) {
				sh.exit(0)
			} else {
				sh.echo(error('不允许在主干分支直接更改代码提交，请联系管理员'))
				sh.exit(1)
			}
		} else if (opt.type === 4) {
			// 在主干分支执行push推送时，检测是否需要先执行pull
		}
	}
	// console.log('1. 当前分支是否合并过dev', getIsMergedBranch())
	// console.log('2. 一周内是否同步过上游分支代码', getIsUpdatedInTime())
	// console.log('3. 最后一条记录是否merge记录', getIsMergeAction())
	// console.log('gitm hook working!', gitHookDir)
	sh.exit(1)
})
program.parse(process.argv)
