#!/usr/bin/env node
const program = require('commander')
const fs = require('fs')
const sh = require('shelljs')
const { options, args } = require('./conf/hook')
const { warning, error, createArgs, compareVersion } = require('./js/index')
const { createHooks, removeHooks, createHookShell, removeHookShell, createLocalShell, removeLocalShell, getIsMergedBranch, getIsUpdatedInTime, getIsMergeAction, getBehandLogs, getAheadLogs } = require('./js/hook')
const config = require('./js/getConfig')()
const { gitHookDir, prefix } = require('./js/gitRevParse')()
const getGitVersion = require('./js/getGitVersion')
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
	// 不检测直接返回
	if (opt.noVerify) {
		sh.exit(0)
		return
	}

	if (command === 'init') {
		// 初始化钩子
		const gitVersion = getGitVersion()
		const gitVersionIsNew = compareVersion(gitVersion, '2.13.0')
		// 集成环境不安装
		if (ciInfo.isCI && config.skipCI) {
			console.info('持续集成环境，跳过钩子安装')
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
		// 初始化钩子
		const gitVersion = getGitVersion()
		const gitVersionIsNew = compareVersion(gitVersion, '2.13.0')
		// 集成环境不安装
		if (ciInfo.isCI && config.skipCI) {
			console.info('持续集成环境，跳过钩子安装')
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
	} else {
		// 检测权限 command = hookName
		// 检测类型对应上面的检测方法
		if (opt.type === '1') {
			// 分支合并主干分支之后，检测该分支是否合并过dev，没有合并过的，不允许继续执行commit
		} else if (opt.type === '2') {
			// 分支合并主干分支之后，检测该分支是否同步过上游分支的代码，没有同步过的，不允许继续执行commit
		} else if (opt.type === '3') {
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
		} else if (opt.type === '4') {
			// 在主干分支执行push推送时，检测是否需要先执行pull
		}
	}
	sh.exit(1)
})
program.parse(process.argv)
