#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { options, args } = require('./conf/hook')
const { error, createArgs } = require('./js/index')
const { init, remove, getIsMergedBranch, getIsUpdatedInTime, getIsMergeAction, getBehandLogs, getAheadLogs } = require('./js/hook')
const config = require('./js/getConfig')()

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
		init()
	} else if (command === 'remove') {
		remove()
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
