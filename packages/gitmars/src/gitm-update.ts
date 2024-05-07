#!/usr/bin/env ts-node
import { program } from 'commander'
import sh from 'shelljs'
import chalk from 'chalk'
import { isNeedUpgrade, queue, upgradeGitmars } from '@gitmars/core'
import {
	checkGitStatus,
	fetch,
	getConfig,
	getCurrentBranch,
	getIsGitProject,
	getIsMergedTargetBranch,
	searchBranches
} from '@gitmars/git'
import { createArgs } from '@gitmars/utils'
import type { CommandType, GitmarsOptionOptionsType } from './types'
import { defaults } from './common/global'
import updateConfig from './conf/update'
import lang from './common/local'

const { t } = lang
const { red } = chalk
const { args, options } = updateConfig

if (!getIsGitProject()) {
	sh.echo(red(t('The current directory is not a git project directory')))
	process.exit(1)
}

const config = getConfig()

interface GitmUpdateOption {
	useMerge?: boolean
	useRebase?: boolean
	all?: boolean
	force?: boolean
}

/**
 * gitm update
 */
program
	.name('gitm update')
	.usage('[type] [name] [--use-merge] [--use-rebase] [-a --all] [-f --force]')
	.description(
		t(
			'Update bug task branch, update feature function development branch, framework adjustment branch support'
		)
	)
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
	program.option(o.flags, o.description, o.defaultValue)
})
// .option('--use-merge', t('Whether to use merge method to update codes, default method is merge'), true)
// .option('--use-rebase', t('Whether to use rebase method update, default method is merge'), false)
// .option('-a --all', t('Update all local bugfix, feature, support branches'), false)
// .option('-f, --force', t('Whether to force a merge request'), false)
program.action(async (type: string | string[], name: string, opt: GitmUpdateOption) => {
	// Checking if a version upgrade is needed
	const needUpgrade = await isNeedUpgrade(config.versionControlType)
	needUpgrade && upgradeGitmars()
	const allow = ['bugfix', 'feature', 'support'] // Permissible commands
	const deny = [
		defaults.master,
		defaults.develop,
		defaults.release,
		defaults.bugfix,
		defaults.support
	]
	const status = checkGitStatus()
	let cmds: Array<CommandType | string | string[]> = [],
		branchList: string[] = [],
		_nameArr: string[] = [] // Array of branch names
	if (!status) process.exit(1)
	fetch()
	if (opt.all) {
		// Update all branches
		if (!type) type = allow.join(',')
		branchList = searchBranches({ type })
	} else if (!type || !name) {
		// type或name没传
		const current = getCurrentBranch()
		;[type, ..._nameArr] = current.split('/')
		name = _nameArr.join('/')
		if (!name) {
			deny.includes(type) &&
				sh.echo(
					red(
						t(
							'Hey bro, what is the fuck are you doing by executing this command in the {type} branch?',
							{ type }
						)
					)
				)
			process.exit(1)
		}
		if (!allow.includes(type as string)) {
			// type is not legal
			sh.echo(red(t('type only allows input') + ': ' + JSON.stringify(allow)))
			process.exit(1)
		}
		branchList = branchList.concat(current)
	} else if (!allow.includes(type as string)) {
		// 传了type和name，但是不合法
		sh.echo(red(t('type only allows input') + ': ' + JSON.stringify(allow)))
		process.exit(1)
	} else {
		// type and name are passed
		branchList = [type + '/' + name]
	}
	branchList.forEach((branch: string) => {
		// feature is pulled from the release, bugfix is pulled from the bug, and support is pulled from the master branch
		;[type, ..._nameArr] = branch.split('/')
		name = _nameArr.join('/')
		const base: string =
			type === 'bugfix' ? config.bugfix : type === 'support' ? config.master : config.release
		const isNeedCombine = !getIsMergedTargetBranch(base, `${type}/${name}`, { remote: true })
		let cmd: Array<CommandType | string | string[]> = []
		if (isNeedCombine || opt.force) {
			cmd = cmd.concat([
				'git fetch',
				`git checkout ${base}`,
				'git pull',
				`git checkout ${type}/${name}`
			])
			if (opt.useRebase) {
				cmd.push({
					cmd: `git rebase ${base}`,
					config: {
						again: false,
						success: t('Merge {source} to {target} successfully', {
							source: base,
							target: `${type}/${name}`
						}),
						fail: t(
							'An error occurred merging {source} to {target}, please follow the instructions',
							{
								source: base,
								target: `${type}/${name}`
							}
						)
					}
				})
			} else {
				cmd.push({
					cmd: `git merge --no-ff ${base}`,
					config: {
						again: false,
						success: t('Merge {source} to {target} successfully', {
							source: base,
							target: `${type}/${name}`
						}),
						fail: t(
							'An error occurred merging {source} to {target}, please follow the instructions',
							{
								source: base,
								target: `${type}/${name}`
							}
						)
					}
				})
			}
		} else {
			cmd = [
				{
					message: t('{source} has been merged with {target}', {
						source: base,
						target: `${type}/${name}`
					})
				}
			]
		}

		cmds = cmds.concat(cmd)
	})
	queue(cmds)
})
program.parse(process.argv)
export {}
