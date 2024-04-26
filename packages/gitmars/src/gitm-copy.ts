#!/usr/bin/env ts-node
import { program } from 'commander'
import dayjs from 'dayjs'
import { checkbox, select } from '@inquirer/prompts'
import sh from 'shelljs'
import chalk from 'chalk'
import { queue } from '@gitmars/core'
import {
	checkGitStatus,
	fetch,
	getCurrentBranch,
	getGitLogs,
	getGitLogsByCommitIDs,
	getIsGitProject,
	prune,
	searchBranches
} from '@gitmars/git'
import { createArgs, echo } from '@gitmars/utils'
import type { GitLogKeysType, GitLogsType } from '@gitmars/git'
import type { CommandType, GitmarsOptionOptionsType } from './types'
import copyConfig from './conf/copy'
import lang from './common/local'

const { t } = lang
const { blue, green, red, yellow } = chalk
const { args, options } = copyConfig

if (!getIsGitProject()) {
	sh.echo(red(t('The current directory is not a git project directory')))
	process.exit(1)
}

interface GitmBuildOption {
	merges: boolean
	lastet: string
	limit: number
}

/**
 * gitm copy
 */
program
	.name('gitm copy')
	.usage('[commitid...] [--lastet [lastet]] [--limit [limit]] [--no-merges]')
	.description(
		t(
			'cherry-pick batch version, copy a record from a branch and merge it into the current branch'
		)
	)
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
	program.option(o.flags, o.description, o.defaultValue)
})
// .option('--no-merges', t('Whether to exclude merge's log'), false)
// .option('--lastet [lastet]', t('Query logs after a certain time, fill in the format: 10s/2m/2h/3d/4M/5y'), '')
// .option('--limit [limit]', t('The maximum number of logs to be queried'))
program.action(async (commitid: string[], opts: GitmBuildOption) => {
	const keys: GitLogKeysType[] = ['%H', '%T', '%P', '%aI', '%an', '%s', '%b']
	const current = getCurrentBranch()
	const status = checkGitStatus()
	let logList: GitLogsType[] = [],
		cmd: Array<CommandType | string | string[]> = []

	if (!status) process.exit(1)
	fetch()
	prune()

	const branches = searchBranches()

	if (commitid.length > 0) {
		// 传入了commitIDs
		logList = getGitLogsByCommitIDs({ commitIDs: commitid, keys })
	} else {
		// 没有传入commitIDs，展示日志列表给用户选择
		logList = getGitLogs({
			lastet: opts.lastet,
			limit: opts.limit,
			noMerges: !opts.merges,
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
		}
	}
	// 多条记录
	const commitIDs = await checkbox<string>({
		message: t('Please select the commit record to copy'),
		choices: logList.map((log, index) => {
			const _time = dayjs(log['%aI']).format('YYYY/MM/DD HH:mm')
			return {
				name: `${green(index + 1 + '.')} ${green(log['%s'])} | ${yellow(log['%an'])} | ${blue(
					_time
				)}`,
				value: log['%H']!,
				checked: false
			}
		})
	})

	// 没有选择任何记录
	if (commitIDs.length === 0) {
		echo(yellow(t('No commit record selected, process has exited')))
		process.exit(0)
	}

	const chooseBranch = await select({
		message: t('Please select the target branch'),
		choices: branches.map(item => ({ name: item, value: item }))
	})

	cmd = [
		`git checkout ${chooseBranch}`,
		'git pull',
		{
			cmd: `git cherry-pick ${commitIDs.reverse().join(' ')}`,
			config: {
				again: false,
				success: t('Record merge successful'),
				fail: t('Merge failed, please follow the instructions')
			}
		},
		`git checkout ${current}`
	]

	// 执行
	queue(cmd)
})
program.parse(process.argv)
export {}
