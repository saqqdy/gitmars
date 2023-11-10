#!/usr/bin/env ts-node
import { program } from 'commander'
import sh from 'shelljs'
import chalk from 'chalk'
import { queue } from '@gitmars/core/lib/queue'
import getIsGitProject from '@gitmars/core/lib/git/getIsGitProject'
import getCurrentBranch from '@gitmars/core/lib/git/getCurrentBranch'
import type { CommandType } from '../typings/gitmars'
import lang from '#lib/common/local'

const { t } = lang
const { red } = chalk

if (!getIsGitProject()) {
	sh.echo(red(t('The current directory is not a git project directory')))
	process.exit(1)
}

/**
 * gitm merge
 */
program
	.name('gitm merge')
	.usage('<name>')
	.arguments('<name>')
	.description(t('Merge branch code'))
	.action((name: string) => {
		const current = getCurrentBranch()
		const cmd: Array<CommandType | string | string[]> = [
			{
				cmd: `git merge --no-ff ${name}`,
				config: {
					again: false,
					success: t('Merge {source} to {target} successfully', {
						source: name,
						target: current
					}),
					fail: t(
						'An error occurred merging {source} to {target}, please follow the instructions',
						{ source: name, target: current }
					)
				}
			},
			{
				cmd: 'git push',
				config: {
					again: true,
					success: t('Successful Pushed'),
					fail: t('Push failed, please follow the prompts')
				}
			}
		]
		queue(cmd)
	})
program.parse(process.argv)
export {}
