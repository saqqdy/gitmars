#!/usr/bin/env ts-node
import { program } from 'commander'
import dayjs from 'dayjs'
import inquirer from 'inquirer'
import sh from 'shelljs'
import chalk from 'chalk'
import { queue } from '@gitmars/core/lib/queue'
import getIsGitProject from '@gitmars/core/lib/git/getIsGitProject'
import getGitLogs from '@gitmars/core/lib/git/getGitLogs'
import getGitLogsByCommitIDs from '@gitmars/core/lib/git/getGitLogsByCommitIDs'
import getCurrentBranch from '@gitmars/core/lib/git/getCurrentBranch'
import { createArgs } from '@gitmars/core/lib/utils/command'
import echo from '@gitmars/core/lib/utils/echo'
import { addRevertCache, getRevertCache, setRevertCache } from '@gitmars/core/lib/cache/revertCache'
import type { GitLogKeysType } from '@gitmars/core/typings/index'
import type {
	CommandType,
	GitLogsType,
	GitmarsOptionOptionsType,
	InitInquirerPromptType,
	RevertCacheType
} from '../typings'
import lang from '#lib/common/local'
import undoConfig from '#lib/conf/undo'

const { t } = lang
const { blue, green, red, yellow } = chalk
const { args, options } = undoConfig

if (!getIsGitProject()) {
	sh.echo(red(t('The current directory is not a git project directory')))
	process.exit(1)
}

interface GitmBuildOption {
	mode: 1 | 2
	merges: boolean
	lastet: string
	limit: number
	calc: boolean
	calcAll: boolean
}

/**
 * 检测要撤销的commit
 *
 * @param commitIDs - 提交ID
 * @param mode - 模式
 * @returns status - return status
 */
function getRevertCommitIDs(commitIDs: string[]): string[] {
	const revertCache = getRevertCache()
	const current = getCurrentBranch()
	let len = commitIDs.length
	while (len--) {
		const _before = revertCache.findIndex(
			(item: RevertCacheType) =>
				item.branch === current && item.before['%H'] === commitIDs[len]
		)
		const _after = revertCache.findIndex(
			(item: RevertCacheType) =>
				item.branch === current && item.after['%H'] === commitIDs[len]
		)
		if (_before > -1 || _after > -1) {
			echo(
				yellow(
					_before > -1
						? t(
								'Detected {id} This record has been revert once, please check if there is an error',
								{ id: commitIDs[len] }
						  )
						: t(
								'The record {id} is detected as a revert record, please use the "gitm redo" operation',
								{ id: commitIDs[len] }
						  )
				)
			)
			commitIDs.splice(len, 1)
		}
	}
	return commitIDs
}

/**
 * 清理撤销失败的记录
 * 1. 执行冲突导致失败，after = null
 * 2. 没有找到撤销记录
 * 3. 有撤销记录，但已经恢复
 *
 * @param all - 是否清理全部，默认只清理当前分支
 * @param opt - option: GitmBuildOption
 */
function calculate(all = false, opt: GitmBuildOption) {
	const keys = ['%H', '%T', '%P', '%aI', '%an', '%s', '%b'] as GitLogKeysType[]
	const revertCache = getRevertCache()
	const current = getCurrentBranch()
	let len = revertCache.length
	while (len--) {
		const { before, after, branch } = revertCache[len]
		let _undoLogs = [],
			_redoLogs = []
		if (!after) {
			// 没有after，尝试恢复
			const _logs = getGitLogs({
				lastet: opt.lastet,
				limit: opt.limit * 2,
				noMerges: true,
				keys,
				branch,
				grep: before['%H']
			})
			if (_logs && _logs.length > 0) revertCache[len].after = _logs[0]
		}
		_undoLogs = getGitLogs({
			lastet: '60d',
			limit: 500,
			noMerges: true,
			keys,
			branch,
			grep: before['%H']
		})
		if (after) {
			_redoLogs = getGitLogs({
				lastet: '60d',
				limit: 500,
				noMerges: true,
				keys,
				branch,
				grep: after['%H']
			})
		}
		// 不检测全部分支时，跳过非当前分支
		if (!all && current !== branch) continue
		// 没有找到该记录的撤销记录 或 撤销的记录被恢复过
		if (_undoLogs.length === 0 || _redoLogs.length > 0) {
			echo(
				yellow(
					_undoLogs.length === 0
						? t(
								'Detected that {id} has failed to undo this record and has deleted the related logs',
								{ id: revertCache[len].before['%H']! }
						  )
						: t(
								'The record {id} was detected to have been recovered, and the related logs were deleted',
								{ id: revertCache[len].before['%H']! }
						  )
				)
			)
			revertCache.splice(len, 1)
		}
	}
	setRevertCache(revertCache)
}

/**
 * gitm undo
 */
program
	.name('gitm undo')
	.usage('[commitid...] [--lastet [lastet]] [--limit [limit]] [-m --mode [mode]] [--no-merges]')
	.description(t('Undo a commit record'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
	program.option(o.flags, o.description, o.defaultValue)
})
// .arguments('[commitid...]')
// .option('--calc', t('Clean up the current branch undo failure log'))
// .option('--calcAll', t('Clean up all failed undo logs'))
// .option('--no-merges', t('Whether to exclude merge's log'))
// .option('-m, --mode [mode]', t('For undoing a merge record, the type to be passed in: 1 = keep current branch code, 2 = keep incoming code'), null)
// .option('--lastet [lastet]', t('Query logs after a certain time, fill in the format: 10s/2m/2h/3d/4M/5y'), '')
// .option('--limit [limit]', t('The maximum number of logs to be queried'))
program.action(async (commitid: string[], opt: GitmBuildOption) => {
	const keys: GitLogKeysType[] = ['%H', '%T', '%P', '%aI', '%an', '%s', '%b']
	const current = getCurrentBranch()
	let logList: GitLogsType[] = [],
		cmd: Array<CommandType | string | string[]> = [],
		commitIDs: string[] = [], // 需要执行的commitID
		mode = ''
	if (opt.calc) {
		calculate(false, opt)
		return
	}
	if (opt.calcAll) {
		calculate(true, opt)
		return
	}
	if (!opt.limit) opt.limit = 20
	mode = ' -m ' + Math.abs(Number(opt.mode || 1))
	if (commitid.length > 0) {
		// 传入了commitIDs
		logList = getGitLogsByCommitIDs({ commitIDs: commitid, keys })
	} else {
		// 没有传入commitIDs，展示日志列表给用户选择
		logList = getGitLogs({
			lastet: opt.lastet,
			limit: opt.limit,
			noMerges: !opt.merges,
			keys
		})
		// 没有查询到日志
		if (logList.length === 0) {
			// 没有查找到任何记录
			echo(
				yellow(
					t(
						'No eligible commit logs found, please relax the filtering conditions appropriately. The process has been exited'
					)
				)
			)
			process.exit(0)
		} else {
			// 多条记录
			const prompt: any = {
				type: 'checkbox',
				message: t('Please select the commit record to undo.'),
				name: 'commitIDs',
				choices: []
			}
			logList.forEach((log, index) => {
				const _time = dayjs(log['%aI']).format('YYYY/MM/DD HH:mm')
				prompt.choices.push({
					name: `${green(index + 1 + '.')} ${green(log['%s'])} | ${yellow(
						log['%an']
					)} | ${blue(_time)}`,
					value: log['%H'],
					checked: false
				})
			})
			commitIDs = (await inquirer.prompt(prompt)).commitIDs
		}
	}
	// 没有选择任何记录
	if (commitIDs.length === 0) {
		echo(yellow(t('No commit record selected, process has exited')))
		process.exit(0)
	}
	// 获取没有被undo过的记录
	commitIDs = getRevertCommitIDs(commitIDs)
	if (commitIDs.length === 0) {
		echo(yellow(t('There are no revocable records, the process has exited')))
		process.exit(0)
	}
	// 筛选被选择的记录
	logList = logList.filter(log => commitIDs.some(id => log['%H']!.includes(id)))
	cmd = logList.map(log => {
		// 判断是否有merge的记录
		// const isMergeLog = log['%P'].indexOf(' ') > -1
		return {
			cmd: `git revert -s --no-edit ${log['%H']}${mode}`,
			config: {
				again: false,
				success: t('Undo successfully: {something}', {
					something: log['%s']!
				}),
				fail: t('An error has occurred, please follow the instructions')
			}
		}
	})
	// 先保存缓存
	const revertCacheList = logList.map(log => {
		const cache = {
			before: log,
			after: null as any,
			branch: current
		}
		const _logs = getGitLogs({
			lastet: opt.lastet,
			limit: opt.limit * 2,
			noMerges: true,
			keys,
			branch: current,
			grep: log['%H']
		})
		if (_logs.length > 0) cache.after = _logs[0]
		return cache
	})
	addRevertCache(revertCacheList)
	// 执行
	queue(cmd)
		.then(() => {
			calculate(false, opt)
		})
		.catch(() => {
			echo(yellow(t('After handling conflicts, execute: gitm undo --calc')))
		})
})

program.parse(process.argv)
export {}
