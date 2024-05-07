#!/usr/bin/env ts-node
import { program } from 'commander'
import sh from 'shelljs'
import chalk from 'chalk'
import { queue } from '@gitmars/core'
import { getIsGitProject } from '@gitmars/git'
import { createArgs } from '@gitmars/utils'
import type { CommandType, GitmarsOptionOptionsType } from './types'
import lang from './common/local'
import revertConfig from './conf/revert'

const { t } = lang
const { red, yellow } = chalk
const { args, options } = revertConfig

if (!getIsGitProject()) {
	sh.echo(red(t('The current directory is not a git project directory')))
	process.exit(1)
}

interface GitmRevertOption {
	number?: number
	mode?: 1 | 2 | ''
}

/**
 * gitm revert
 */
program
	.name('gitm revert')
	.usage('[commitid] [-n --number [number]] [-m --mode [mode]]')
	.description(t('Undo a commit record'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
	program.option(o.flags, o.description, o.defaultValue)
})
// .arguments('[commitid]')
// .option('-n, --number [number]', t('Undo the last commit (or undo the penultimate nth commit)'), '')
// .option('-m, --mode [mode]', t('For undoing a merge record, the type to be passed in: 1 = keep current branch code, 2 = keep incoming code'), '')
program.action((commitid: string, opt: GitmRevertOption) => {
	const cmd: Array<CommandType | string | string[]> = []
	let n = 'HEAD',
		m = ''
	if (opt.mode) m = ' -m ' + Math.abs(Number(opt.mode))
	if (opt.number) {
		const num = Math.abs(Number(opt.number))
		if (num > 1) n += '~' + (num - 1)
		cmd.push({
			cmd: `git revert ${n}${m}`,
			config: {
				again: true,
				success: t('Successfully reverted'),
				fail: t('An error has occurred, please follow the instructions')
			}
		})
	} else if (commitid) {
		cmd.push({
			cmd: `git revert ${commitid}${m}`,
			config: {
				again: true,
				success: t('Successfully reverted'),
				fail: t('An error has occurred, please follow the instructions')
			}
		})
	} else {
		sh.echo(yellow(t('Commands do not meet the specifications')))
		process.exit(1)
	}
	queue(cmd)
})
program.parse(process.argv)
export {}
