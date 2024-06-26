#!/usr/bin/env ts-node
import { program } from 'commander'
import sh from 'shelljs'
import { confirm, input, select } from '@inquirer/prompts'
import chalk from 'chalk'
import to from 'await-to-done'
import { createArgs } from '@gitmars/utils'
import { getGitConfig, getIsGitProject } from '@gitmars/git'
import { getBuildConfig, getProjectOption, runJenkins } from '@gitmars/build'
import type { ApolloBranchList } from '@gitmars/build'
import type { GitmarsOptionOptionsType } from './types'
import lang from './common/local'
import buildConfig from './conf/build'

const { t } = lang
const { red, yellow } = chalk
const { args, options } = buildConfig

interface GitmBuildOption {
	env?: ApolloBranchList
	app?: string
	data?: string
	confirm?: boolean
}
/**
 * gitm build
 */
program
	.name('gitm build')
	.usage('[project] [-e --env [env]] [-a --app [app]] [-d --data <data>] [-c --confirm]')
	.description(t('Launching a jenkins build task'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
	program.option(o.flags, o.description, o.defaultValue)
})
// .option('-e, --env [env]', t('Environment to be built, optionally dev, prod, bug, all'), '')
// .option('-a, --app [app]', t('Application to be built'), '')
// .option('-d, --data <data>', t('Other data to be transferred'), '{}')
// .option('-c, --confirm', t('Confirm start, do not show confirmation box when true'), false)
program.action(async (project: string, opt: GitmBuildOption): Promise<void> => {
	const data = JSON.parse(opt.data || '{}')
	let env = opt.env,
		app = opt.app,
		_confirm = opt.confirm

	if (!project) {
		if (getIsGitProject()) project = getGitConfig().appName
		else {
			;[, project = ''] = await to(
				input({
					message: t('Enter project name'),
					transformer: val => val.trim()
				}).then(val => val.trim())
			)
		}
	}

	if (!env) {
		;[, env] = await to(
			select({
				message: t('Select the environment to build'),
				choices: [
					{
						name: 'dev',
						value: 'dev',
						description: t('Test environment(alpha)')
					},
					{
						name: 'bug',
						value: 'bug',
						description: t('Pre-release tag environment(bug)')
					},
					{
						name: 'prod',
						value: 'prod',
						description: t('Pre-release prod environment(prod)')
					}
				]
			})
		)
	}

	const [, buildConfig] = await to(getBuildConfig(false))
	const projectOption = await getProjectOption(project, env!, buildConfig)
	if (!app) {
		if (!buildConfig) {
			;[, app] = await to(
				input({
					message: t('Enter the application to build'),
					transformer: val => val.trim()
				}).then(val => val.trim())
			)
		} else if (projectOption?.apps) {
			;[, app] = await to(
				select<string>({
					message: t('Select the application to build'),
					choices: projectOption.apps.map(name => ({
						name,
						value: name
					}))
				})
			)
		}
		// no apps means no-need to enter app name
	}

	// 有opt.data时强制确认
	if (!_confirm || (opt.data && opt.data !== '{}')) {
		let message = `${yellow(t('Please double check the following build parameters'))}\n${t(
			'Project Name'
		)}: ${red(project)}\n${t('Code Branch')}: ${red(env)}\n${t('Build Application')}: ${red(
			app
		)}`

		if ('build_api_env' in data)
			message += `\n${t('Interface Environment')}: ${red(data.build_api_env || 'production')}`
		if ('mini_program' in data)
			message += `\n${t('Experience version pushed to')}: ${red(data.mini_program || t('Push to templates only'))}`
		if ('description' in data)
			message += `\n${t('Version Description')}: ${red(data.description)}`
		if ('clean' in data)
			message += `\n${t('Clean node modules (use with caution)')}: ${red(data.clean)}`
		;[, _confirm] = await to(confirm({ message }))
	}

	if (!_confirm) sh.exit(1)
	else
		runJenkins({
			env: env!,
			project,
			app: app!,
			data: opt.data
		})
})
program.parse(process.argv)
export {}
