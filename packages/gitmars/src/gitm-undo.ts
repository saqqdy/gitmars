#!/usr/bin/env ts-node
import { program } from 'commander'
import dayjs from 'dayjs'
import { checkbox } from '@inquirer/prompts'
import sh from 'shelljs'
import chalk from 'chalk'
import to from 'await-to-done'
import { queue } from '@gitmars/core'
import { getCurrentBranch, getGitLogs, getGitLogsByCommitIDs, getIsGitProject } from '@gitmars/git'
import { createArgs, echo } from '@gitmars/utils'
import { addRevertCache, getRevertCache, setRevertCache } from '@gitmars/cache'
import type { RevertCacheType } from '@gitmars/cache'
import type { GitLogKeysType, GitLogsType } from '@gitmars/git'
import type { CommandType, GitmarsOptionOptionsType } from './types'
import lang from './common/local'
import undoConfig from './conf/undo'

const { t } = lang
const { blue, green, red, yellow } = chalk
const { args, options } = undoConfig

if (!getIsGitProject()) {
	sh.echo(red(t('The current directory is not a git project directory')))
	process.exit(1)
}

interface GitmUndoOption {
	mode: 1 | 2
	merges: boolean
	lastet: string
	limit: number
	calc: boolean
	calcAll: boolean
}

/**
 * Check the commits to undo
 *
 * @param commitIDs - Commit IDs
 * @param mode - Mode
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
 * Clean up failed undo records
 * 1. Failed due to conflict, after = null
 * 2. No undo record found
 * 3. Has undo record but already restored
 *
 * @param all - Whether to clean all, default only clean current branch
 * @param opt - option: GitmUndoOption
 */
function calculate(all = false, opt: GitmUndoOption) {
	const keys = ['%H', '%T', '%P', '%aI', '%an', '%s', '%b'] as GitLogKeysType[]
	const revertCache = getRevertCache()
	const current = getCurrentBranch()
	let len = revertCache.length
	while (len--) {
		const { before, after, branch } = revertCache[len]
		let _undoLogs = [],
			_redoLogs = []
		if (!after) {
			// No after, try to restore
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
		// Skip non-current branches when not checking all branches
		if (!all && current !== branch) continue
		// No undo record found for this record or the undo record has been restored
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
program.action(async (commitid: string[], opt: GitmUndoOption) => {
	const keys: GitLogKeysType[] = ['%H', '%T', '%P', '%aI', '%an', '%s', '%b']
	const current = getCurrentBranch()
	let logList: GitLogsType[] = [],
		cmd: Array<CommandType | string | string[]> = [],
		commitIDs: string[] = [], // commitIDs to execute
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
		// commitIDs passed in
		logList = getGitLogsByCommitIDs({ commitIDs: commitid, keys })
	} else {
		// No commitIDs passed, show log list for user to select
		logList = getGitLogs({
			lastet: opt.lastet,
			limit: opt.limit,
			noMerges: !opt.merges,
			keys
		})
		// No logs found
		if (logList.length === 0) {
			// No records found
			echo(
				yellow(
					t(
						'No eligible commit logs found, please relax the filtering conditions appropriately. The process has been exited'
					)
				)
			)
			process.exit(0)
		} else {
			// Multiple records
			;[, commitIDs = []] = await to(
				checkbox<string>({
					message: t('Please select the commit record to undo.'),
					choices: logList.map((log, index) => {
						const _time = dayjs(log['%aI']).format('YYYY/MM/DD HH:mm')
						return {
							name: `${green(index + 1 + '.')} ${green(log['%s'])} | ${yellow(
								log['%an']
							)} | ${blue(_time)}`,
							value: log['%H']!,
							checked: false
						}
					})
				})
			)
		}
	}
	// No records selected
	if (commitIDs.length === 0) {
		echo(yellow(t('No commit record selected, process has exited')))
		process.exit(0)
	}
	// Get records that haven't been undone
	commitIDs = getRevertCommitIDs(commitIDs)
	if (commitIDs.length === 0) {
		echo(yellow(t('There are no revocable records, the process has exited')))
		process.exit(0)
	}
	// Filter selected records
	logList = logList.filter(log => commitIDs.some(id => log['%H']!.includes(id)))
	cmd = logList.map(log => {
		// Check if there are merge records
		// const isMergeLog = log['%P'].indexOf(' ') > -1
		return {
			cmd: `git revert -s --no-edit ${log['%H']}${mode}`,
			config: {
				again: false,
				success: t('Undo successfully: {something}', {
					something: log['%s']!
				}),
				fail: t('An error has occurred, please follow the prompts')
			}
		}
	})
	// Save cache first
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
	// Execute
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
