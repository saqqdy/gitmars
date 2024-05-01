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
	getIsGitProject,
	getIsMergedTargetBranch,
	getIsUpdatedInTime,
	searchBranches
} from '@gitmars/git'
import { createArgs } from '@gitmars/utils'
import { getUserInfo } from '@gitmars/api'
import type { CommandType, FetchDataType, GitmarsOptionOptionsType } from './types'
import lang from './common/local'
import { defaults } from './common/global'
import combineConfig from './conf/combine'

const { t } = lang
const require = createRequire(import.meta.url)
const { red, green, yellow } = chalk

if (!getIsGitProject()) {
	sh.echo(red(t('The current directory is not a git project directory')))
	process.exit(1)
}

const mergeRequestModule = require.resolve('@gitmars/api')
// const mergeRequestModule = import.meta.resolve('@gitmars/api')

interface GitmBuildOption {
	dev?: boolean
	prod?: boolean
	build?: boolean | string
	commit?: boolean | string
	description?: string
	add?: boolean
	noBugfix?: boolean
	asFeature?: boolean
	force?: boolean
	data?: string
}

export interface DevelopBranchStatusInfo {
	branchName: string
	type: string
	name: string
	isNeedCombineDevelop: boolean
	isNeedCombineBase: boolean
	isNeedCombineRelease: boolean
	isNeedCombineBugfix: boolean
}

const { args, options } = combineConfig
const { appName } = getGitConfig()
const config = getConfig()

/**
 * gitm combine
 */
program
	.name('gitm combine')
	.usage(
		'[type] [name] [-d --dev] [-p --prod] [-b --build [app]] [-a --add] [-m --commit <commit>] [--data <data>] [--description [description]] [--as-feature] [--no-bugfix] [-f --force]'
	)
	.description(
		t('Merge bugfix task branch, merge feature development branch, merge support branch')
	)
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
	program.option(o.flags, o.description, o.defaultValue)
})
// .option('-d, --dev', t('Whether to sync to alpha test environment'), false)
// .option('-p, --prod', t('Whether to sync to pre-release environment'), false)
// .option('-b, --build [build]', t('Application to be built'))
// .option('-m, --commit <commit>', t('commit information'), '')
// .option('--description [description]', t('Description of the reason for this commit'), '')
// .option('-a, --add', t('Need to add'), false)
// .option('--no-bugfix', t('Do not sync to bug branch'))
// .option('--as-feature', t('bug branch merge to release'))
// .option('-f, --force', t('Whether to force a merge request'), false)
// .option('--data <data>', t('Other data to be transferred'), '{}')
program.action(async (type: string, name: string, opt: GitmBuildOption): Promise<void> => {
	const userInfoApi = config.apis?.userInfo?.url || config.api
	// Detecting if a version upgrade is needed
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
	const status = !opt.add && opt.commit === '' ? checkGitStatus() : true
	let _branches: string[] = [], // Branches found
		pendingBranches: DevelopBranchStatusInfo[] = [], // Batch pending branches
		isDescriptionCorrect = true // Does the description of the reason for this submission meet the specification
	if (!opt.dev && !opt.prod) {
		sh.echo(t('Enter the environment to sync to.'))
		process.exit(1)
	}
	if (!status) process.exit(1)
	if (opt.commit === true) {
		sh.echo(red(t('Enter the message to be submitted')))
		process.exit(1)
	}
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
		// type and name are not passed and the current branch is a development branch
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

	const base: string = type === 'bugfix' ? config.bugfix : config.release
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
		// Is it necessary to merge release
		const isNeedCombineRelease = !getIsMergedTargetBranch(branchName, config.release, {
			remote: true
		})
		// Is it necessary to merge bug
		const isNeedCombineBugfix = !getIsMergedTargetBranch(branchName, config.bugfix, {
			remote: true
		})
		return {
			branchName,
			type: _type,
			name: _name,
			isNeedCombineDevelop,
			isNeedCombineBase,
			isNeedCombineRelease,
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
					if (!item.isNeedCombineRelease) _merged.push(config.release)
					if (!item.isNeedCombineBugfix) _merged.push(config.bugfix)
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
						checked: false
					}
				})
			})
		)
	}

	if (!pendingBranches.length) {
		sh.echo(t('No pending branches, program exits'))
		process.exit(0)
	}

	if (opt.add) {
		cmd.push('git add .')
	}
	if (opt.commit) {
		cmd.push(`git commit -m "${opt.commit}"`)
	}

	for (const {
		branchName,
		type,
		isNeedCombineDevelop,
		isNeedCombineBase,
		isNeedCombineRelease,
		isNeedCombineBugfix
	} of pendingBranches) {
		// Get whether the upstream branch code has been synchronized within a week
		if (!getIsUpdatedInTime({ lastet: '7d', limit: 1000, branch: base })) {
			sh.echo(
				yellow(
					t(
						'The {source} branch has not updated its upstream branch code in over a week, please sync it at least once a week, execute: gitm update (-f)',
						{
							source: branchName
						}
					)
				)
			)
		}

		// combine to dev
		if (opt.dev) {
			if (isNeedCombineDevelop || opt.force)
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
			else
				cmd.push({
					message: t('{source} has been merged with {target}', {
						source: branchName,
						target: config.develop
					})
				})
			if (opt.build) {
				cmd.push({
					cmd: `gitm build ${appName} --confirm --env dev --app ${
						opt.build === true ? 'all' : opt.build
					} ${opt.data ? ' --data ' + opt.data : ''}`,
					config: {
						stdio: 'inherit',
						again: false,
						success: t('Pulling up the build was successful'),
						fail: t('Failed to pull up the build')
					}
				})
			}
		}
		// Start merging to prod
		if (opt.prod) {
			// Determine if has merged dev branch
			if (!opt.dev && isNeedCombineDevelop) {
				sh.echo(
					yellow(
						t(
							'If your branch has not been merged into {target}, please merge it into the {target} branch first',
							{ target: config.develop }
						)
					)
				)
				process.exit(1)
			}

			// merge to prod
			if (!opt.noBugfix && !opt.asFeature) {
				// noBugfix - do not merge to bug branch
				const weekday = new Date().getDay()
				// Thursday Friday Sunday merge code into bugfix branch prompts warnings
				if ([0, 4, 5].includes(weekday) && base === config.bugfix) {
					sh.echo(
						yellow(
							t('Use the {base} branch for posting on Thursday, Friday, and Sunday', {
								base: config.release
							})
						)
					)
				}

				if (!level || level < 3) {
					if (isNeedCombineBase || opt.force)
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
							`git checkout ${branchName}`
						)
					else
						cmd.push({
							message: t('{source} has been merged with {target}', {
								source: branchName,
								target: base
							})
						})
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
			// bugfix分支走release发布
			if (type === 'bugfix' && opt.asFeature) {
				if (!level || level < 3) {
					if (isNeedCombineRelease || opt.force)
						cmd.push(
							'git fetch',
							`git checkout ${config.release}`,
							'git pull',
							{
								cmd: `git merge --no-ff ${branchName}`,
								config: {
									again: false,
									success: t('Merge {source} into {target} successfully', {
										source: branchName,
										target: config.release
									}),
									fail: t(
										'An error occurred merging {source} to {target}, Please follow the instructions',
										{
											source: branchName,
											target: config.release
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
					else
						cmd.push({
							message: t('{source} has been merged with {target}', {
								source: branchName,
								target: config.release
							})
						})
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
									target_branch: config.release,
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
									target: config.release
								}
							)}"`
						]
					)
				}
			}
			// support分支需要合到bugfix
			if (type === 'support' && opt.noBugfix) {
				if (!level || level < 3) {
					if (isNeedCombineBugfix || opt.force)
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
					else
						cmd.push({
							message: t('{source} has been merged with {target}', {
								source: branchName,
								target: config.bugfix
							})
						})
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
			// 仅支持构建bug
			if (opt.build) {
				if (!level || level < 3) {
					if (type === 'bugfix') {
						cmd.push({
							cmd: `gitm build ${appName} --confirm --env bug --app ${
								opt.build === true ? 'all' : opt.build
							} ${opt.data ? ' --data ' + opt.data : ''}`,
							config: {
								stdio: 'inherit',
								again: false,
								success: t('Pulling up the build was successful'),
								fail: t('Failed to pull up the build')
							}
						})
					}
					// support分支要构建bug和release
					if (type === 'support' && opt.noBugfix) {
						cmd.push({
							cmd: `gitm build ${appName} --confirm --env bug --app ${
								opt.build === true ? 'all' : opt.build
							} ${opt.data ? ' --data ' + opt.data : ''}`,
							config: {
								stdio: 'inherit',
								again: false,
								success: t('Pulling up the build was successful'),
								fail: t('Failed to pull up the build')
							}
						})
					}
				} else {
					sh.echo(
						yellow(
							t(
								'This process will not automatically execute the build process, please wait for the administrator to review the code and execute it: gitm build {appName} -e prod -a {app} {data}',
								{
									appName,
									app: opt.build === true ? 'all' : opt.build,
									data: opt.data ? ' --data ' + opt.data : ''
								}
							)
						)
					)
				}
			}
		}
	}

	queue(cmd)
})
program.parse(process.argv)
export {}
