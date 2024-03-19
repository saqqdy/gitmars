#!/usr/bin/env ts-node
import { program } from 'commander'
import sh from 'shelljs'
import chalk from 'chalk'
import { queue } from '@gitmars/core'
import { getIsBranchOrCommitExist, getIsGitProject, searchBranches } from '@gitmars/git'
import { createArgs } from '@gitmars/utils'
import type { CommandType, GitmarsBranchType, GitmarsOptionOptionsType } from './types'
import branchConfig from './conf/branch'
import lang from './common/local'

const { t } = lang
const { green, red } = chalk
const { args, options } = branchConfig

if (!getIsGitProject()) {
	sh.echo(red(t('The current directory is not a git project directory')))
	process.exit(1)
}

interface GitmBuildOption {
	key?: string
	exclude?: string
	include?: string
	remote?: boolean
	type?: GitmarsBranchType
	delete?: string | null
	forcedelete?: string | null
	upstream?: string
}

/**
 * gitm branch
 */
program
	.name('gitm branch')
	.usage(
		'[-k --key [keyword]] [-t --type [type]] [-d --delete [branch]] [--exclude [exclude]] [--include [include]] [-r --remote [remote]] [-D --forcedelete [branch]] [-u --upstream [upstream]]'
	)
	.description(
		t(
			'Branch query, delete (note that this command is not used to create a branch, if you want to create a branch please go through the start process)'
		)
	)
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
	program.option(o.flags, o.description, o.defaultValue)
})
// .option('-k, --key [keyword]', t('Query branch for keywords'), null)
// .option('--exclude [exclude]', t('Exclude keywords'), '')
// .option('--include [include]', t('Include keywords'), '')
// .option('-r, --remote', t('Whether to query remote branches (change to delete remote branches in deletes mode) Default is local only'), false)
// .option('-t, --type [type]', t('The type of branch to query, there are 3 types: feature, bugfix, support, if not pass then query all'), null)
// .option('-d, --delete [branch]', t('Delete branch'), null)
// .option('-D, --forcedelete [branch]', t('Force branch deletion'), null)
// .option('-u, --upstream [upstream]', t('Set association with remote branches'))
program.action((opt: GitmBuildOption): void => {
	const cmd: Array<CommandType | string | string[]> = []
	const isBranchExist = getIsBranchOrCommitExist(opt.delete)
	if (opt.delete) {
		// delete branches
		if (isBranchExist) cmd.push(`git branch -d ${opt.delete}`)
		if (opt.remote) cmd.push(`git push origin --delete ${opt.delete}`)
		cmd.push({
			cmd: 'git remote prune origin',
			config: {
				again: true,
				success: t('Cleanup of remote branch was successful'),
				fail: t('Failed to clean up remote branch, please follow the prompts')
			}
		})
	} else if (opt.forcedelete) {
		// force delete branches
		if (isBranchExist) cmd.push(`git branch -D ${opt.forcedelete}`)
		if (opt.remote) cmd.push(`git push origin --delete ${opt.delete}`)
		cmd.push({
			cmd: 'git remote prune origin',
			config: {
				again: true,
				success: t('Cleanup of remote branch was successful'),
				fail: t('Failed to clean up remote branch, please follow the prompts')
			}
		})
	} else if (opt.upstream) {
		if (typeof opt.upstream === 'string') {
			// set upstream to origin
			cmd.push(`git branch --set-upstream-to origin/${opt.upstream}`)
		} else {
			// unset upstream to origin
			cmd.push('git branch --unset-upstream')
		}
	} else {
		// filter branches
		const branches = searchBranches({
			remote: opt.remote,
			type: opt.type,
			key: opt.key,
			exclude: opt.exclude,
			include: opt.include
		})
		sh.echo(green(branches.join('\n')))
		return
	}
	queue(cmd)
})
program.parse(process.argv)
export {}
