#!/usr/bin/env ts-node
import { createRequire } from 'node:module'
import { Command } from 'commander'
import chalk from 'chalk'
import { getType } from 'js-cool'
import { getUserInfo } from '@gitmars/api'
import { createArgs, echo, spawnSync } from '@gitmars/utils'
import { queue } from '@gitmars/core'
import {
	checkGitStatus,
	fetch,
	getConfig,
	getCurrentBranch,
	getGitConfig,
	getIsBranchOrCommitExist,
	getIsGitProject,
	getIsMergedTargetBranch
} from '@gitmars/git'
import type {
	CommandType,
	FetchDataType,
	GitmarsMainBranchType,
	GitmarsOptionOptionsType
} from './types'
import lang from './common/local'
import adminConfig from './conf/admin'

const { t } = lang
const require = createRequire(import.meta.url)
const { green, red, yellow } = chalk

if (!getIsGitProject()) {
	echo(red(t('The current directory is not a git project directory')))
	process.exit(1)
}

const { appName } = getGitConfig()
const config = getConfig()
const userInfoApi = config.apis?.userInfo?.url || config.api
const mergeRequestModule = require.resolve('@gitmars/core/lib/api/mergeRequest')
const { approve, clean, create, publish, update } = adminConfig
interface GitmBuildOption {
	publish: {
		combine?: boolean
		useRebase?: boolean
		prod?: boolean
		build?: boolean | string
		description?: string
		postmsg?: boolean
		force?: boolean
		data?: string
	}
	update: {
		useRebase?: boolean
		mode?: 0 | 1 | 2
		description?: string
		postmsg?: boolean
		force?: boolean
	}
}

type PublishOptsType = 'bugfix' | 'support' | 'release'

/**
 * gitm admin create
 * gitm admin publish
 * gitm admin update
 * gitm admin clean
 * gitm admin approve
 */
const program = new Command()

const createProgram = program
	.name('gitm admin')
	.usage('<command> <type>')
	.description(t('Create bugfix, release, develop and support branches'))
	.command('create ' + createArgs(create.args))
create.options.forEach((o: GitmarsOptionOptionsType) => {
	createProgram.option(o.flags, o.description, o.defaultValue)
})
// .command('create <type>')
createProgram.action((type: GitmarsMainBranchType): void => {
	const opts = ['bugfix', 'release', 'develop', 'support'] // Permissible commands
	const base: string = type === 'release' ? config.master : config.release
	const status = checkGitStatus()
	const hasBase = getIsBranchOrCommitExist(base)
	const exits = getIsBranchOrCommitExist(config[type])
	if (!status) process.exit(1)
	if (!hasBase) {
		echo(red(t('{base} branch does not exist, please create a {base} branch first', { base })))
		process.exit(1)
	}
	if (exits) {
		echo(
			red(
				t('The {branch} branch already exists and does not need to be created again', {
					branch: config[type]
				})
			)
		)
		process.exit(1)
	}
	if (opts.includes(type)) {
		// release pulls from master, others from release
		const cmd = [
			'git fetch',
			`git checkout ${base}`,
			'git pull',
			`git checkout -b ${config[type]} ${base}`
		]
		queue(cmd).then((data: any[]) => {
			if (data[3].status === 0) {
				echo(
					t(
						'The {target} branch was created successfully and is based on {base}, you have now switched to {target}\nWhen you need to publish, remember to run: {command}',
						{
							target: config[type],
							base,
							command: green('gitm admin publish ' + config[type])
						}
					)
				)
			}
		})
	} else {
		echo(red(t('type only allows input') + ': ' + opts.join(',')))
		process.exit(1)
	}
})

const publishProgram = program
	.name('gitm admin')
	.usage(
		'<command> <type> [--description [description]] [-c --combine] [--use-rebase] [-p --prod] [-b --build [app]] [-d --data <data>] [--postmsg] [-f --force]'
	)
	.description(t('Release bugfix, release, support branches'))
	.command('publish ' + createArgs(publish.args))
publish.options.forEach((o: GitmarsOptionOptionsType) => {
	publishProgram.option(o.flags, o.description, o.defaultValue)
})
// .command('publish <type>')
// .option('-c, --combine', t('Whether to sync the release code to the bug'), false)
// .option('--use-rebase', t('Whether to update using rebase method, default merge'), false)
// .option('-p, --prod', t('Whether to merge bugs to master when publishing bug branches'), false)
// .option('-b, --build [build]', t('Application to be built'))
// .option('--postmsg', t('Send Message'), false)
// .option('--description [description]', t('Description of the reason for this commit'), '')
// .option('-f, --force', t('Whether to force a merge request'), false)
// .option('-d --data <data>', t('Other data to be transferred'), '{}')
publishProgram.action(
	async (type: PublishOptsType, opt: GitmBuildOption['publish']): Promise<void> => {
		const { level, nickname = '' } = userInfoApi ? await getUserInfo() : ({} as FetchDataType)
		const opts = ['bugfix', 'release', 'support'] // Permissible commands
		const status = checkGitStatus()
		const curBranch = await getCurrentBranch()
		let isDescriptionCorrect = true // Does the description of the reason for this submission meet the specification
		if (!status) process.exit(1)
		fetch()
		// When there is a descriptionValidator configured, the description information needs to be verified
		if (config.descriptionValidator) {
			// Verify the description for this commit
			const reg =
				getType(config.descriptionValidator) === 'regexp'
					? (config.descriptionValidator as RegExp)
					: new RegExp(config.descriptionValidator)
			isDescriptionCorrect = Boolean(opt.description && reg.test(opt.description))
		}
		const isNeedCombineBugfixToRelease = !getIsMergedTargetBranch(
			`origin/${config.bugfix}`,
			config.release,
			{ remote: true }
		)
		const isNeedCombineSupportToRelease = !getIsMergedTargetBranch(
			`origin/${config.support}`,
			config.release,
			{ remote: true }
		)
		const isNeedCombineSupportToBugfix = !getIsMergedTargetBranch(
			`origin/${config.support}`,
			config.bugfix,
			{ remote: true }
		)
		const isNeedCombineReleaseToMaster = !getIsMergedTargetBranch(
			`origin/${config.release}`,
			config.master,
			{ remote: true }
		)
		if (opts.includes(type)) {
			/**
			 * bugfix -> master/release
			 * release -> master
			 * develop -> null
			 * support -> bugfix/release
			 */
			let cmd: {
				[prop in PublishOptsType]: Array<CommandType | string | string[]>
			}
			if (!level || level < 4) {
				cmd = {
					bugfix:
						isNeedCombineBugfixToRelease || opt.force
							? [
									'git fetch',
									`git checkout ${config.bugfix}`,
									'git pull',
									`git checkout ${config.release}`,
									'git pull',
									{
										cmd: `git merge --no-ff ${config.bugfix}`,
										config: {
											again: false,
											postmsg: opt.postmsg,
											success: t(
												'Merge {source} into {target} successfully',
												{
													source: config.bugfix,
													target: config.release
												}
											),
											fail: t(
												'An error occurred merging {source} to {target}, Please follow the instructions',
												{
													source: config.bugfix,
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
									}
								]
							: [
									{
										message: t('{source} has been merged with {target}', {
											source: config.bugfix,
											target: config.release
										})
									}
								],
					support: ([] as Array<CommandType | string | string[]>)
						.concat(
							isNeedCombineSupportToRelease || opt.force
								? [
										'git fetch',
										`git checkout ${config.support}`,
										'git pull',
										`git checkout ${config.release}`,
										'git pull',
										{
											cmd: `git merge --no-ff ${config.support}`,
											config: {
												again: false,
												success: t(
													'Merge {source} into {target} successfully',
													{
														source: config.support,
														target: config.release
													}
												),
												fail: t(
													'An error occurred merging {source} to {target}, Please follow the instructions',
													{
														source: config.support,
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
										}
									]
								: [
										{
											message: t('{source} has been merged with {target}', {
												source: config.support,
												target: config.release
											})
										}
									]
						)
						.concat(
							isNeedCombineSupportToBugfix || opt.force
								? [
										`git checkout ${config.bugfix}`,
										'git pull',
										{
											cmd: `git merge --no-ff ${config.support}`,
											config: {
												again: false,
												success: t(
													'Merge {source} into {target} successfully',
													{
														source: config.support,
														target: config.bugfix
													}
												),
												fail: t(
													'An error occurred merging {source} to {target}, Please follow the instructions',
													{
														source: config.support,
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
										}
									]
								: [
										{
											message: t('{source} has been merged with {target}', {
												source: config.support,
												target: config.bugfix
											})
										}
									]
						),
					release:
						isNeedCombineReleaseToMaster || opt.force
							? [
									'git fetch',
									`git checkout ${config.release}`,
									'git pull',
									`git checkout ${config.master}`,
									'git pull',
									{
										cmd: `git merge --no-ff ${config.release}`,
										config: {
											again: false,
											success: t(
												'Merge {source} into {target} successfully',
												{
													source: config.release,
													target: config.master
												}
											),
											fail: t(
												'An error occurred merging {source} to {target}, Please follow the instructions',
												{
													source: config.release,
													target: config.master
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
									}
								]
							: [
									{
										message: t('{source} has been merged with {target}', {
											source: config.release,
											target: config.master
										})
									}
								]
				}
			} else {
				if (!isDescriptionCorrect) {
					echo(
						red(
							t(
								'The description of the reason for submission does not meet the specification'
							)
						)
					)
					process.exit(1)
				}
				cmd = {
					bugfix:
						isNeedCombineBugfixToRelease || opt.force
							? [
									{
										cmd: {
											module: mergeRequestModule,
											entry: 'createMergeRequest',
											options: {
												source_branch: config.bugfix,
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
												source: config.bugfix,
												target: config.release
											}
										)}"`
									]
								]
							: [
									{
										message: t('{source} has been merged with {target}', {
											source: config.bugfix,
											target: config.release
										})
									}
								],
					support: ([] as Array<CommandType | string | string[]>)
						.concat(
							isNeedCombineSupportToRelease || opt.force
								? [
										{
											cmd: {
												module: mergeRequestModule,
												entry: 'createMergeRequest',
												options: {
													source_branch: config.support,
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
													source: config.support,
													target: config.release
												}
											)}"`
										]
									]
								: [
										{
											message: t('{source} has been merged with {target}', {
												source: config.support,
												target: config.release
											})
										}
									]
						)
						.concat(
							isNeedCombineSupportToBugfix || opt.force
								? [
										{
											cmd: {
												module: mergeRequestModule,
												entry: 'createMergeRequest',
												options: {
													source_branch: config.support,
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
													source: config.support,
													target: config.bugfix
												}
											)}"`
										]
									]
								: [
										{
											message: t('{source} has been merged with {target}', {
												source: config.support,
												target: config.bugfix
											})
										}
									]
						),
					release:
						isNeedCombineReleaseToMaster || opt.force
							? [
									{
										cmd: {
											module: mergeRequestModule,
											entry: 'createMergeRequest',
											options: {
												source_branch: config.release,
												target_branch: config.master,
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
												source: config.release,
												target: config.master
											}
										)}"`
									]
								]
							: [
									{
										message: t('{source} has been merged with {target}', {
											source: config.release,
											target: config.master
										})
									}
								]
				}
			}
			// Publish the bug branch and sync to master
			if (type === 'bugfix' && opt.prod) {
				// Is it necessary to merge master?
				const isNeedCombine = !getIsMergedTargetBranch(
					`origin/${config.bugfix}`,
					config.master,
					{ remote: true }
				)
				if (!level || level < 4) {
					cmd[type] = cmd[type].concat(
						isNeedCombine || opt.force
							? [
									`git checkout ${config.master}`,
									'git pull',
									{
										cmd: `git merge --no-ff ${config.bugfix}`,
										config: {
											again: false,
											success: t(
												'Merge {source} into {target} successfully',
												{
													source: config.bugfix,
													target: config.master
												}
											),
											fail: t(
												'An error occurred merging {source} to {target}, Please follow the instructions',
												{
													source: config.bugfix,
													target: config.master
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
									}
								]
							: [
									{
										message: t('{source} has been merged with {target}', {
											source: config.bugfix,
											target: config.master
										})
									}
								]
					)
				} else {
					if (!isDescriptionCorrect) {
						echo(
							red(
								t(
									'The description of the reason for submission does not meet the specification'
								)
							)
						)
						process.exit(1)
					}
					cmd[type] = cmd[type].concat(
						isNeedCombine || opt.force
							? [
									{
										cmd: {
											module: mergeRequestModule,
											entry: 'createMergeRequest',
											options: {
												source_branch: config.bugfix,
												target_branch: config.master,
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
												source: config.bugfix,
												target: config.master
											}
										)}"`
									]
								]
							: [
									{
										message: t('{source} has been merged with {target}', {
											source: config.bugfix,
											target: config.master
										})
									}
								]
					)
				}
				if (opt.build) {
					if (!level || level < 4) {
						cmd[type] = cmd[type].concat([
							{
								cmd: `gitm build ${appName} --confirm --env bug --app ${
									opt.build === true ? 'all' : opt.build
								} ${opt.data ? ' --data ' + opt.data : ''}`,
								config: {
									stdio: 'inherit',
									again: false,
									success: t('Pulling up the build was successful'),
									fail: t('Failed to pull up the build')
								}
							}
						])
					} else {
						echo(
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
			// release release branch
			if (type === 'release' && opt.build) {
				if (!level || level < 4) {
					cmd[type] = cmd[type].concat([
						{
							cmd: `gitm build ${appName} --confirm --env prod --app ${
								opt.build === true ? 'all' : opt.build
							} ${opt.data ? ' --data ' + opt.data : ''}`,
							config: {
								stdio: 'inherit',
								again: false,
								success: t('Pulling up the build was successful'),
								fail: t('Failed to pull up the build')
							}
						}
					])
				} else {
					echo(
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
			// Release the release branch and sync the release code to the bug line
			if (type === 'release' && opt.combine) {
				// Is it necessary to merge to the bug
				const isNeedCombine = !getIsMergedTargetBranch(
					`origin/${config.release}`,
					config.bugfix,
					{ remote: true }
				)
				// use rebase
				if (opt.useRebase) {
					cmd[type] = cmd[type].concat(
						isNeedCombine || opt.force
							? [
									`git checkout ${config.release}`,
									'git pull',
									`git checkout ${config.bugfix}`,
									{
										cmd: `git pull origin ${config.bugfix} --rebase`,
										config: { again: true }
									},
									{
										cmd: `git rebase ${config.release}`,
										config: {
											again: false,
											postmsg: opt.postmsg,
											success: t('Merge {source} to {target} successfully', {
												source: config.release,
												target: config.bugfix
											}),
											fail: t(
												'An error occurred merging {source} to {target}, please follow the instructions',
												{
													source: config.release,
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
									}
								]
							: [
									{
										message: t('{source} has been merged with {target}', {
											source: config.release,
											target: config.bugfix
										})
									}
								]
					)
				} else {
					if (!level || level < 4) {
						cmd[type] = cmd[type].concat(
							isNeedCombine || opt.force
								? [
										`git checkout ${config.release}`,
										'git pull',
										`git checkout ${config.bugfix}`,
										'git pull',
										{
											cmd: `git merge --no-ff ${config.release}`,
											config: {
												again: false,
												postmsg: opt.postmsg,
												success: t(
													'Merge {source} into {target} successfully',
													{
														source: config.release,
														target: config.bugfix
													}
												),
												fail: t(
													'An error occurred merging {source} to {target}, Please follow the instructions',
													{
														source: config.release,
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
										}
									]
								: [
										{
											message: t('{source} has been merged with {target}', {
												source: config.release,
												target: config.bugfix
											})
										}
									]
						)
					} else {
						if (!isDescriptionCorrect) {
							echo(
								red(
									t(
										'The description of the reason for submission does not meet the specification'
									)
								)
							)
							process.exit(1)
						}
						cmd[type] = cmd[type].concat([
							{
								cmd: {
									module: mergeRequestModule,
									entry: 'createMergeRequest',
									options: {
										source_branch: config.release,
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
										source: config.release,
										target: config.bugfix
									}
								)}"`
							]
						])
					}
				}
			}
			// eslint-disable-next-line one-var
			let key: keyof typeof cmd
			// Back to current branch
			for (key in cmd) {
				cmd[key].push(`git checkout ${curBranch}`)
			}
			queue(cmd[type])
		} else {
			echo(red(t('type only allows input') + ': ' + opts.join(',')))
			process.exit(1)
		}
	}
)

const updateProgram = program
	.name('gitm admin')
	.usage(
		'<command> <type> [-m --mode [mode]] [--description [description]] [--use-rebase] [--postmsg] [-f --force]'
	)
	.description(t('Update bugfix, release, support branch code'))
	.command('update ' + createArgs(update.args))
update.options.forEach((o: GitmarsOptionOptionsType) => {
	updateProgram.option(o.flags, o.description, o.defaultValue)
})
// .command('update <type>')
// .option('--use-rebase', t('Whether to update using rebase method, default merge'), false)
// .option('-m, --mode [mode]', t('In case of a conflict, whether to keep the incoming code or the current code; 1=use current 2=use incoming; default is 0=handle manually. This parameter must not be used with --use-rebase'), 0)
// .option('--postmsg', t('Send Message'), false)
// .option('--description [description]', t('Description of the reason for this commit'), '')
// .option('-f, --force', t('Whether to force a merge request'), false)
updateProgram.action(
	async (type: GitmarsMainBranchType, opt: GitmBuildOption['update']): Promise<void> => {
		const { level, nickname = '' } = userInfoApi ? await getUserInfo() : ({} as FetchDataType)
		const opts = ['bugfix', 'release', 'support'] // Permissible commands
		const base = type === 'release' ? config.master : config.release
		const status = checkGitStatus()
		let mode = '', // Which code to keep in case of conflict
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
		if (opt.mode === 1) {
			mode = ' --strategy-option ours'
		} else if (opt.mode === 2) {
			mode = ' --strategy-option theirs'
		}
		fetch()
		if (opts.includes(type)) {
			// Is it necessary to merge
			const isNeedCombine = !getIsMergedTargetBranch(`origin/${base}`, config[type], {
				remote: true
			})
			let cmd
			if (isNeedCombine || opt.force) {
				if (!level || level < 4) {
					cmd = [
						'git fetch',
						`git checkout ${base}`,
						'git pull',
						`git checkout ${config[type]}`,
						{
							cmd: 'git pull',
							config: { again: true }
						},
						{
							cmd: `git merge --no-ff ${base}${mode}`,
							config: {
								again: false,
								postmsg: opt.postmsg,
								success: t('Merge {source} to {target} successfully', {
									source: base,
									target: config[type]
								}),
								fail: t(
									'An error occurred merging {source} to {target}, please follow the instructions',
									{
										source: base,
										target: config[type]
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
						}
					]
				} else {
					if (!isDescriptionCorrect) {
						echo(
							red(
								t(
									'The description of the reason for submission does not meet the specification'
								)
							)
						)
						process.exit(1)
					}
					cmd = [
						{
							cmd: {
								module: mergeRequestModule,
								entry: 'createMergeRequest',
								options: {
									source_branch: base,
									target_branch: config[type],
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
									source: base,
									target: config[type]
								}
							)}"`
						]
					]
				}
				if (opt.useRebase) {
					cmd = [
						'git fetch',
						`git checkout ${base}`,
						'git pull',
						`git checkout ${config[type]}`,
						{
							cmd: `git pull origin ${config[type]} --rebase`,
							config: { again: true }
						},
						{
							cmd: `git rebase ${base}`,
							config: {
								again: false,
								postmsg: opt.postmsg,
								success: t('Merge {source} to {target} successfully', {
									source: base,
									target: config[type]
								}),
								fail: t(
									'An error occurred merging {source} to {target}, please follow the instructions',
									{
										source: base,
										target: config[type]
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
						}
					]
				}
			} else {
				cmd = [
					{
						message: t('{source} has been merged with {target}', {
							source: base,
							target: config[type]
						})
					}
				]
			}
			queue(cmd)
		} else {
			echo(red(t('type only allows input') + ': ' + opts.join(',')))
			process.exit(1)
		}
	}
)

const cleanProgram = program
	.name('gitm admin')
	.usage('<command> <type>')
	.description(t('Build cleanup job'))
	.command('clean ' + createArgs(clean.args))
clean.options.forEach((o: GitmarsOptionOptionsType) => {
	cleanProgram.option(o.flags, o.description, o.defaultValue)
})
// .command('clean <type>')
cleanProgram.action((type: GitmarsMainBranchType): void => {
	const opts = ['bugfix', 'release', 'develop', 'master'] // Permissible commands
	const status = checkGitStatus()
	if (!status) process.exit(1)
	if (opts.includes(type)) {
		let cmd = [
			'git fetch',
			'git checkout . -f',
			'git clean -fd',
			`git checkout ${config.master}`,
			`git branch -D ${config[type]}`,
			{
				cmd: 'git remote prune origin',
				config: {
					again: true,
					success: t('Cleanup of remote branch was successful'),
					fail: t('Failed to clean up remote branch, please follow the prompts')
				}
			},
			'git fetch',
			`git checkout ${config[type]}`,
			'git pull'
		]
		if (type === 'master') {
			cmd = [
				'git checkout .',
				'git clean -fd',
				`git checkout ${config.master}`,
				'git clean -fd',
				'git fetch',
				'git pull'
			]
		}
		queue(cmd)
	} else {
		echo(red(t('type only allows input') + ': ' + opts.join(',')))
		process.exit(1)
	}
})

const approveProgram = program
	.name('gitm admin')
	.usage('[type] [-k --key [keyword]]')
	.description(t('Approve merge request'))
	.command('approve ' + createArgs(approve.args))
approve.options.forEach((o: GitmarsOptionOptionsType) => {
	approveProgram.option(o.flags, o.description, o.defaultValue)
})
// .command('approve')
approveProgram.action((): void => {
	spawnSync('gitm', ['approve', '--state', 'opened'], { stdio: 'inherit' })
})

program.parse(process.argv)
export {}
