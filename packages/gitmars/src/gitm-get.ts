#!/usr/bin/env ts-node
import { program } from 'commander'
import sh from 'shelljs'
import chalk from 'chalk'
import { queue } from '@gitmars/core'
import { getCurrentBranch, getIsGitProject, getStashList } from '@gitmars/git'
import { createArgs } from '@gitmars/utils'
import type { GitmarsOptionOptionsType } from './types'
import lang from './common/local'
import getConfig from './conf/get'

const { t } = lang
const { red, yellow } = chalk
const { args, options } = getConfig

if (!getIsGitProject()) {
	sh.echo(red(t('The current directory is not a git project directory')))
	process.exit(1)
}

interface GitmGetOption {
	keep?: boolean
}

/**
 * gitm get
 */
program
	.name('gitm get')
	.usage('[message] [index] [-k --keep [keep]]')
	.description(t('Restore staging area file'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
	program.option(o.flags, o.description, o.defaultValue)
})
// .option('-k, --keep [keep]', t('Keep staging area not deleted'), false)
program.action((message: string, index: string, opt: GitmGetOption) => {
	if (!message) message = getCurrentBranch()
	const list = getStashList(message)
	if (list.length === 0) {
		sh.echo(yellow(t('There are no files staged in this branch!')))
		process.exit(0)
	}
	if (index === undefined && list.length > 1) {
		sh.echo(
			yellow(
				t(
					'There are {length} staging records under this branch, and the most recent one is restored by default',
					{ length: String(list.length) }
				)
			)
		)
	}
	if (list.length > 2) {
		sh.echo(
			yellow(
				t(
					'There are {length} staging records under this branch, please clean up unnecessary staging records regularly',
					{ length: String(list.length) }
				)
			)
		)
	}
	queue([
		{
			cmd: `git stash ${opt.keep ? 'apply' : 'pop'} ${list[Number(index) || 0].key}`,
			config: {
				again: opt.keep ? false : `git stash drop ${list[Number(index) || 0].key}`,
				success: t('File recovery successful'),
				fail: t('Recovery failed, please check for conflicts')
			}
		},
		'git reset -q HEAD -- .'
	])
})
program.parse(process.argv)
export {}
