#!/usr/bin/env ts-node
import { program } from 'commander'
import dayjs from 'dayjs'
import { checkbox } from '@inquirer/prompts'
import sh from 'shelljs'
import chalk from 'chalk'
import to from 'await-to-done'
import { queue } from '@gitmars/core'
import { getCurrentBranch, getIsGitProject } from '@gitmars/git'
import { createArgs, echo } from '@gitmars/utils'
import { delRevertCache, getRevertCache } from '@gitmars/cache'
import type { RevertCacheType } from '@gitmars/cache'
import type { CommandType, GitmarsOptionOptionsType } from './types'
import lang from './common/local'
import redoConfig from './conf/redo'

const { t } = lang
const { blue, green, red, yellow } = chalk
const { args, options } = redoConfig

if (!getIsGitProject()) {
	sh.echo(red(t('The current directory is not a git project directory')))
	process.exit(1)
}

interface GitmBuildOption {
	branch?: string
	mode?: 1 | 2
}

/**
 * gitm redo
 */
program
	.name('gitm redo')
	.usage('[commitid...] [-m --mode [mode]]')
	.description(t('Undo a commit record'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
	program.option(o.flags, o.description, o.defaultValue)
})
// .arguments('[commitid...]')
// .option('-m, --mode [mode]', t('For undoing a merge record, the type to be passed in: 1 = keep current branch code, 2 = keep incoming code'), null)
program.action(async (commitid: string[], opt: GitmBuildOption) => {
	const current = getCurrentBranch()
	let revertCache: RevertCacheType[] = getRevertCache(current),
		cmd: Array<CommandType | string | string[]> = [],
		mode = ''
	mode = ' -m ' + Math.abs(Number(opt.mode || 1))
	if (commitid.length > 0) {
		// 传入了commitIDs
		revertCache = revertCache.filter(item =>
			commitid.some(id => item.after['%H']!.includes(id))
		)
	}
	// 没有查询到日志
	if (revertCache.length === 0) {
		// 没有查找到任何记录
		echo(yellow(t('No recoverable undo logs found, process exited')))
		process.exit(0)
	}
	// 多条记录
	const [, commitIDs = []] = await to(
		checkbox({
			message: t('Please select the undo record to restore'),
			choices: revertCache.map(({ after }, index) => {
				const _time = dayjs(after['%aI']).format('YYYY/MM/DD HH:mm')
				return {
					name: `${green(index + 1 + '.')} ${green(after['%s'])} | ${yellow(
						after['%an']
					)} | ${blue(_time)}`,
					value: after['%H']!,
					checked: false
				}
			})
		})
	)
	// 没有选择任何记录
	if (commitIDs.length === 0) {
		echo(yellow(t('No logs selected, process has exited')))
		process.exit(0)
	}
	// 筛选被选择的记录
	revertCache = revertCache.filter(item => commitIDs.includes(item.after['%H']!))
	cmd = revertCache.map(item => ({
		cmd: `git revert -s --no-edit ${item.after['%H']}${mode}`,
		config: {
			again: false,
			success: t('Undo successfully: {something}', {
				something: item.after['%s']!
			}),
			fail: t('An error has occurred, please follow the instructions')
		}
	}))
	// 执行
	queue(cmd).then(() => {
		delRevertCache(commitIDs)
	})
})
program.parse(process.argv)
export {}
