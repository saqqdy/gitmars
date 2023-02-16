#!/usr/bin/env ts-node
import { createRequire } from 'node:module'
import { program } from 'commander'
import sh from 'shelljs'
import chalk from 'chalk'
import getType from 'js-cool/es/getType'
import { queue } from '@gitmars/core/lib/queue'
import getIsGitProject from '@gitmars/core/lib/git/getIsGitProject'
import getCurrentBranch from '@gitmars/core/lib/git/getCurrentBranch'
import getGitConfig from '@gitmars/core/lib/git/getGitConfig'
import getIsMergedTargetBranch from '@gitmars/core/lib/git/getIsMergedTargetBranch'
import getIsBranchOrCommitExist from '@gitmars/core/lib/git/getIsBranchOrCommitExist'
import checkGitStatus from '@gitmars/core/lib/git/checkGitStatus'
import searchBranches from '@gitmars/core/lib/git/searchBranches'
import { createArgs } from '@gitmars/core/lib/utils/command'
import { isNeedUpgrade, upgradeGitmars } from '@gitmars/core/lib/versionControl'
import getConfig from '@gitmars/core/lib/getConfig'
import getUserToken from '@gitmars/core/lib/api/getUserToken'
import type { CommandType, FetchDataType, GitmarsOptionOptionsType } from '../typings'
import lang from '#lib/common/local'
import { defaults } from '#lib/common/global'
import endConfig from '#lib/conf/end'

const { t } = lang
const require = createRequire(import.meta.url)
const { args, options } = endConfig
const { red } = chalk

if (!getIsGitProject()) {
	sh.echo(red(t('The current directory is not a git project directory')))
	process.exit(1)
}

const config = getConfig()
const { appName } = getGitConfig()
const mergeRequestModule = require.resolve('@gitmars/core/lib/api/mergeRequest')

interface GitmBuildOption {
	combine?: boolean
	asFeature?: boolean
	description?: string
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
	const userInfoApi =
		(config.apis && config.apis.userInfo && config.apis.userInfo.url) || config.api
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
	const {
		token,
		level,
		nickname = ''
	} = userInfoApi ? await getUserToken() : ({} as FetchDataType)
	const status = checkGitStatus()
	let _nameArr: string[] = [], // 分支名称数组
		isDescriptionCorrect = true // Does the description of the reason for this submission meet the specification
	if (!status) process.exit(1)
	// When there is a descriptionValidator configured, the description information needs to be verified
	if (config.descriptionValidator) {
		// Verify the description for this commit
		const reg =
			getType(config.descriptionValidator) === 'regexp'
				? config.descriptionValidator
				: new RegExp(config.descriptionValidator)
		isDescriptionCorrect = opt.description && reg.test(opt.description)
	}
	if (!type) {
		// type和name都没传且当前分支是开发分支
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
	} else if (!name) {
		// 传了type没传name
		if (allow.includes(type)) {
			sh.echo(t('Please enter branch name'))
			process.exit(1)
		}
		const branches = searchBranches({ type })
		if (branches.length === 1) {
			;[type, ..._nameArr] = branches[0].split('/')
			name = _nameArr.join('/')
		} else {
			sh.echo(
				branches.length > 1
					? t(
							'If you find multiple branches with names containing {type}, please enter the branch type',
							{ type }
					  )
					: red(t('Branch does not exist, please enter it correctly'))
			)
			process.exit(1)
		}
	}
	const isRemoteBranchExist = getIsBranchOrCommitExist(`${type}/${name}`, true)
	if (allow.includes(type) && name) {
		const base: string = opt.asFeature
			? config.release
			: type === 'bugfix'
			? config.bugfix
			: config.release
		let cmd: Array<CommandType | string | string[]> = []
		// Is it necessary to merge dev
		const isNeedCombineDevelop = !getIsMergedTargetBranch(`${type}/${name}`, config.develop, {
			remote: true
		})
		// Is it necessary to merge base
		const isNeedCombineBase = !getIsMergedTargetBranch(`${type}/${name}`, base, {
			remote: true
		})
		// Is it necessary to merge bug
		const isNeedCombineBugfix = !getIsMergedTargetBranch(`${type}/${name}`, config.bugfix, {
			remote: true
		})
		if (opt.combine && isNeedCombineDevelop) {
			// 需要合并代码到dev
			cmd = [
				'git fetch',
				`git checkout ${config.develop}`,
				'git pull',
				{
					cmd: `git merge --no-ff ${type}/${name}`,
					config: {
						again: false,
						success: t('Merge {source} into {target} successfully', {
							source: `${type}/${name}`,
							target: config.develop
						}),
						fail: t(
							'An error occurred merging {source} to {target}, Please follow the instructions',
							{
								source: `${type}/${name}`,
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
				`git checkout ${type}/${name}`
			]
		}
		// support分支需要合到bugfix
		if (type === 'support' && opt.combine && isNeedCombineBugfix) {
			if (!level || level < 3) {
				cmd = cmd.concat([
					'git fetch',
					`git checkout ${config.bugfix}`,
					'git pull',
					{
						cmd: `git merge --no-ff ${type}/${name}`,
						config: {
							again: false,
							success: t('Merge {source} into {target} successfully', {
								source: `${type}/${name}`,
								target: config.bugfix
							}),
							fail: t(
								'An error occurred merging {source} to {target}, Please follow the instructions',
								{
									source: `${type}/${name}`,
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
					`git checkout ${type}/${name}`
				])
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
				cmd = cmd.concat([
					{
						cmd: `git push --set-upstream origin ${type}/${name}`,
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
								source_branch: `${type}/${name}`,
								target_branch: config.bugfix,
								token,
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
						`postmsg "${t(
							'{nickname} submitted a merge request for {source} branch to {target} branch in {app} project',
							{
								nickname,
								app: appName,
								source: `${type}/${name}`,
								target: config.bugfix
							}
						)}"`
					]
				])
			}
		}
		if (!opt.combine || !isNeedCombineBase) {
			// 不合并代码
			cmd = cmd.concat([
				`git checkout ${config.develop}`,
				`git branch -D ${type}/${name}`,
				{
					cmd: 'git remote prune origin',
					config: {
						again: true,
						success: t('Cleanup of remote branch was successful'),
						fail: t('Failed to clean up remote branch, please follow the prompts')
					}
				}
			])
			// 判断远程是否存在分支
			if (isRemoteBranchExist) {
				cmd = cmd.concat([
					{
						cmd: `git push origin --delete ${type}/${name}`,
						config: {
							again: true,
							success: t('Successfully deleted remote branch'),
							fail: t('Deletion failed, please contact administrator')
						}
					}
				])
			}
		} else {
			// 需要合并代码
			if (!level || level < 3) {
				cmd = cmd.concat([
					'git fetch',
					`git checkout ${base}`,
					'git pull',
					{
						cmd: `git merge --no-ff ${type}/${name}`,
						config: {
							again: false,
							success: t('Merge {source} into {target} successfully', {
								source: `${type}/${name}`,
								target: base
							}),
							fail: t(
								'An error occurred merging {source} to {target}, Please follow the instructions',
								{
									source: `${type}/${name}`,
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
					`git branch -D ${type}/${name}`,
					{
						cmd: 'git remote prune origin',
						config: {
							again: true,
							success: t('Cleanup of remote branch was successful'),
							fail: t('Failed to clean up remote branch, please follow the prompts')
						}
					}
				])
				// 判断远程是否存在分支
				if (isRemoteBranchExist) {
					cmd = cmd.concat([
						{
							cmd: `git push origin --delete ${type}/${name}`,
							config: {
								again: true,
								success: t('Successfully deleted remote branch'),
								fail: t('Deletion failed, please contact administrator')
							}
						}
					])
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
				cmd = cmd.concat([
					{
						cmd: `git push --set-upstream origin ${type}/${name}`,
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
								source_branch: `${type}/${name}`,
								target_branch: base,
								token,
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
						`postmsg "${t(
							'{nickname} submitted a merge request for {source} branch to {target} branch in {app} project',
							{
								nickname,
								app: appName,
								source: `${type}/${name}`,
								target: base
							}
						)}"`
					]
				])
			}
		}
		queue(cmd)
	} else {
		sh.echo(red(t('type only allows input') + ': ' + JSON.stringify(allow)))
		process.exit(1)
	}
})
program.parse(process.argv)
export {}
