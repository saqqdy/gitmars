#!/usr/bin/env ts-node
import { program } from 'commander'
import dayjs from 'dayjs'
import columnify from 'columnify'
import chalk from 'chalk'
import { getGitLogs, getIsGitProject } from '@gitmars/git'
import { createArgs, echo } from '@gitmars/utils'
import type { GitLogsType } from '@gitmars/git'
import type { GitmarsOptionOptionsType } from './types'
import logConfig from './conf/log'
import lang from './common/local'

const { t } = lang
const { blue, cyan, green, red, yellow } = chalk
const { args, options } = logConfig

if (!getIsGitProject()) {
	echo(red(t('The current directory is not a git project directory')))
	process.exit(1)
}

interface GitmLogOption {
	lastet?: string
	limit?: number
	merges?: boolean
	json: boolean
}

/**
 * gitm log
 */
program
	.name('gitm log')
	.usage('[branch] [--lastet [lastet]] [--limit [limit]] [--no-merges] [--json]')
	.description(t('Log query'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
	program.option(o.flags, o.description, o.defaultValue)
})
// .option('--lastet [lastet]', t('Query logs after a certain time, fill in the format: 10s/2m/2h/3d/4M/5y'), '')
// .option('--no-merges', t('Whether to exclude merge's log'))
// .option('--limit [limit]', t('The maximum number of logs to be queried'))
// .option('--json', t('Whether to output logs in json format, default form'), false)
program.action(async (branch: string, opt: GitmLogOption) => {
	const logs = getGitLogs({
		lastet: opt.lastet,
		limit: opt.limit,
		branch,
		noMerges: !opt.merges
	})
	if (opt.json) {
		console.info(logs)
	} else {
		const data = logs.map((log: GitLogsType) => ({
			commit: cyan(log['%h']),
			merge: cyan(log['%p']),
			title: green(log['%s']),
			// author: yellow(`${log['%an']}<${log['%ae']}>`),
			author: yellow(log['%an']),
			date: blue(dayjs(log['%aI']).format('YYYY/MM/DD HH:mm:ss'))
		}))
		echo(columnify(data))
	}
	process.exit(0)
})

program.parse(process.argv)
export {}
