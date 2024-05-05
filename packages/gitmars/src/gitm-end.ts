#!/usr/bin/env ts-node
import { createRequire } from 'node:module'
import { program } from 'commander'
import sh from 'shelljs'
import chalk from 'chalk'
import { checkbox } from '@inquirer/prompts'
import to from 'await-to-done'
import { getType } from 'js-cool'
import { isNeedUpgrade, queue, upgradeGitmars } from '@gitmars/core'
import {
	checkGitStatus,
	getConfig,
	getCurrentBranch,
	getGitConfig,
	getIsBranchOrCommitExist,
	getIsGitProject,
	getIsMergedTargetBranch,
	searchBranches
} from '@gitmars/git'
import { createArgs } from '@gitmars/utils'
import { getUserInfo } from '@gitmars/api'
import type { CommandType, FetchDataType, GitmarsOptionOptionsType } from './types'
import lang from './common/local'
import { defaults } from './common/global'
import endConfig from './conf/end'

const { t } = lang
const require = createRequire(import.meta.url)
const { args, options } = endConfig
const { red, green } = chalk

if (!getIsGitProject()) {
	sh.echo(red(t('The current directory is not a git project directory')))
	process.exit(1)
}

const config = getConfig()
const { appName } = getGitConfig()
const mergeRequestModule = require.resolve('@gitmars/api')
// const mergeRequestModule = import.meta.resolve('@gitmars/api')

interface GitmBuildOption {
	combine?: boolean
	asFeature?: boolean
	description?: string
}

export interface DevelopBranchStatusInfo {
	branchName: string
	type: string
	name: string
	isSafe: boolean
	isRemoteBranchExist: boolean
	isNeedCombineDevelop: boolean
	isNeedCombineBase: boolean
	isNeedCombineBugfix: boolean
}

/**
 * gitm end
 */
program
	.name('gitm end')
	.usage('[type] [name] [--description [description]] [--as-feature] [--no-combine]')
	.description(
		t(
			'Merge bugfix task branch, merge feature function development branch, the corresponding branch will be deleted after the merge is completed'
		)
	)
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
	program.option(o.flags, o.description, o.defaultValue)
})
// .option('--no-combine', t('Do not merge trunk branches (make sure the branch is live)'))
// .option('--as-feature', t('bug branch merge to release'))
// .option('--description [description]', t('Description of the reason for this commit'), '')
program.action(async (type: string, name: string, opt: GitmBuildOption): Promise<void> => {
	const userInfoApi = config.apis?.userInfo?.url || config.api
	// Detecting if it is necessary to upgrade
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
	const { level, nickname = '' } = userInfoApi ? await getUserInfo() : ({} as FetchDataType)
	const status = checkGitStatus()
	let _branches: string[] = [], // Branches found
		pendingBranches: DevelopBranchStatusInfo[] = [], // Batch pending branches
		isDescriptionCorrect = true // Does the description of the reason for this submission meet the specification
	if (!status) process.exit(1)
	// When there is a descriptionValidator configured, the description information needs to be verified
	if (config.descriptionValidator) {
		// Verify the description for this commit
		const reg =
			getType(config.descriptionValidator) === 'regexp'
				? (config.descriptionValidator as RegExp)
				: new RegExp(config.descriptionValidator)
		isDescriptionCorrect = Boolean(opt.description && reg.test(opt.description))
	}
	if (!type) {
		// type and name are not passed and the current branch is a development branch.
		let _nameArr
		;[type, ..._nameArr] = getCurrentBranch().split('/')
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
	}

	// wrong type
	if (!allow.includes(type)) {
		sh.echo(red(t('type only allows input') + ': ' + JSON.stringify(allow)))
		process.exit(1)
	} else if (type === 'feature' && opt.asFeature) {
		sh.echo(t('--as-feature is only used in the bugfix branch.'))
		process.exit(1)
	}

	// Passed type but not name.
	if (!name) {
		_branches = searchBranches({ type })
		if (!_branches.length) {
			sh.echo(red(t('Branch does not exist, please enter it correctly')))
			process.exit(1)
		}
	} else {
		_branches = [type + '/' + name]
	}

	const base: string = opt.asFeature
		? config.release
		: type === 'bugfix'
			? config.bugfix
			: config.release
	const cmd: Array<CommandType | string | string[]> = []
	const branchesWithInfo: DevelopBranchStatusInfo[] = _branches.map(branchName => {
		const [_type, ..._nameArr] = branchName.split('/')
		const _name = _nameArr.join('/')
		// Is it necessary to merge dev
		const isNeedCombineDevelop = !getIsMergedTargetBranch(branchName, config.develop, {
			remote: true
		})
		// Is it necessary to merge base
		const isNeedCombineBase = !getIsMergedTargetBranch(branchName, base, {
			remote: true
		})
		// Is it necessary to merge bug, only for support branch
		const isNeedCombineBugfix = !getIsMergedTargetBranch(branchName, config.bugfix, {
			remote: true
		})
		return {
			branchName,
			type: _type,
			name: _name,
			isSafe:
				_type === config.support
					? !isNeedCombineDevelop && !isNeedCombineBase && !isNeedCombineBugfix
					: !isNeedCombineDevelop && !isNeedCombineBase,
			isRemoteBranchExist: getIsBranchOrCommitExist(branchName, true),
			isNeedCombineDevelop,
			isNeedCombineBase,
			isNeedCombineBugfix
		}
	})

	if (branchesWithInfo.length === 1) pendingBranches = branchesWithInfo
	else {
		;[, pendingBranches = []] = await to(
			checkbox<DevelopBranchStatusInfo>({
				message: t('Select branch for batch processing'),
				choices: branchesWithInfo.map(item => {
					const _merged = []
					if (!item.isNeedCombineDevelop) _merged.push(config.develop)
					if (!item.isNeedCombineBase) _merged.push(base)
					if (item.type === config.support && !item.isNeedCombineBugfix)
						_merged.push(config.bugfix)

					return {
						name: t('{source}{info}', {
							source: item.branchName,
							info: _merged.length
								? green(
										' (' +
											t(`Merged branch: {info}`, {
												info: _merged.join('/')
											}) +
											')'
									)
								: ''
						}),
						value: item,
						checked: item.isSafe
					}
				})
			})
		)
	}

	if (!pendingBranches.length) {
		sh.echo(t('No pending branches, program exits'))
		process.exit(0)
	}

	for (const {
		branchName,
		type,
		isRemoteBranchExist,
		isNeedCombineDevelop,
		isNeedCombineBase,
		isNeedCombineBugfix
	} of pendingBranches) {
		if (opt.combine && isNeedCombineDevelop) {
			// 需要合并代码到dev
			cmd.push(
				'git fetch',
				`git checkout ${config.develop}`,
				'git pull',
				{
					cmd: `git merge --no-ff ${branchName}`,
					config: {
						again: false,
						success: t('Merge {source} into {target} successfully', {
							source: branchName,
							target: config.develop
						}),
						fail: t(
							'An error occurred merging {source} to {target}, Please follow the instructions',
							{
								source: branchName,
								target: config.develop
							}
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
				},
				`git checkout ${branchName}`
			)
		}
		// support分支需要合到bugfix
		if (type === 'support' && opt.combine && isNeedCombineBugfix) {
			if (!level || level < 3) {
				cmd.push(
					'git fetch',
					`git checkout ${config.bugfix}`,
					'git pull',
					{
						cmd: `git merge --no-ff ${branchName}`,
						config: {
							again: false,
							success: t('Merge {source} into {target} successfully', {
								source: branchName,
								target: config.bugfix
							}),
							fail: t(
								'An error occurred merging {source} to {target}, Please follow the instructions',
								{
									source: branchName,
									target: config.bugfix
								}
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
					},
					`git checkout ${branchName}`
				)
			} else {
				if (!isDescriptionCorrect) {
					sh.echo(
						red(
							t(
								'The description of the reason for submission does not meet the specification'
							)
						)
					)
					process.exit(1)
				}
				cmd.push(
					{
						cmd: `git push --set-upstream origin ${branchName}`,
						config: {
							again: true,
							success: t('Push remote and associate remote branch successfully'),
							fail: t('Push remote failed, please follow the prompts')
						}
					},
					{
						cmd: {
							module: mergeRequestModule,
							entry: 'createMergeRequest',
							options: {
								source_branch: branchName,
								target_branch: config.bugfix,
								description: opt.description
							}
						},
						config: {
							again: true,
							success: t('Successfully created merge request'),
							fail: t(
								'There was an error creating the merge request, please follow the instructions'
							)
						}
					},
					[
						'gitm',
						'postmsg',
						`"${t(
							'{nickname} submitted a merge request for {source} branch to {target} branch in {app} project',
							{
								nickname,
								app: appName,
								source: branchName,
								target: config.bugfix
							}
						)}"`
					]
				)
			}
		}
		if (!opt.combine || !isNeedCombineBase) {
			// 不合并代码
			cmd.push(`git checkout ${config.develop}`, `git branch -D ${branchName}`, {
				cmd: 'git remote prune origin',
				config: {
					again: true,
					success: t('Cleanup of remote branch was successful'),
					fail: t('Failed to clean up remote branch, please follow the prompts')
				}
			})
			// 判断远程是否存在分支
			if (isRemoteBranchExist) {
				cmd.push({
					cmd: `git push origin --delete ${branchName}`,
					config: {
						again: true,
						success: t('Successfully deleted remote branch'),
						fail: t('Deletion failed, please contact administrator')
					}
				})
			}
		} else {
			// 需要合并代码
			if (!level || level < 3) {
				cmd.push(
					'git fetch',
					`git checkout ${base}`,
					'git pull',
					{
						cmd: `git merge --no-ff ${branchName}`,
						config: {
							again: false,
							success: t('Merge {source} into {target} successfully', {
								source: branchName,
								target: base
							}),
							fail: t(
								'An error occurred merging {source} to {target}, Please follow the instructions',
								{
									source: branchName,
									target: base
								}
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
					},
					`git checkout ${config.develop}`,
					`git branch -D ${branchName}`,
					{
						cmd: 'git remote prune origin',
						config: {
							again: true,
							success: t('Cleanup of remote branch was successful'),
							fail: t('Failed to clean up remote branch, please follow the prompts')
						}
					}
				)
				// 判断远程是否存在分支
				if (isRemoteBranchExist) {
					cmd.push({
						cmd: `git push origin --delete ${branchName}`,
						config: {
							again: true,
							success: t('Successfully deleted remote branch'),
							fail: t('Deletion failed, please contact administrator')
						}
					})
				}
			} else {
				if (!isDescriptionCorrect) {
					sh.echo(
						red(
							t(
								'The description of the reason for submission does not meet the specification'
							)
						)
					)
					process.exit(1)
				}
				cmd.push(
					{
						cmd: `git push --set-upstream origin ${branchName}`,
						config: {
							again: true,
							success: t('Push remote and associate remote branch successfully'),
							fail: t('Push remote failed, please follow the prompts')
						}
					},
					{
						cmd: {
							module: mergeRequestModule,
							entry: 'createMergeRequest',
							options: {
								source_branch: branchName,
								target_branch: base,
								description: opt.description
							}
						},
						config: {
							again: true,
							success: t('Successfully created merge request'),
							fail: t(
								'There was an error creating the merge request, please follow the instructions'
							)
						}
					},
					[
						'gitm',
						'postmsg',
						`"${t(
							'{nickname} submitted a merge request for {source} branch to {target} branch in {app} project',
							{
								nickname,
								app: appName,
								source: branchName,
								target: base
							}
						)}"`
					]
				)
			}
		}
	}

	queue(cmd)
})
program.parse(process.argv)
export {}
