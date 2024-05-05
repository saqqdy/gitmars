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
import buildMpConfig from './conf/build-mp'

const { t } = lang
const { red, yellow } = chalk
const { args, options } = buildMpConfig

interface GitmBuildMpOption {
	env?: ApolloBranchList
	app?: string
	data?: string
	confirm?: boolean
	build_api_env?: 'alpha' | 'tag' | 'release' | 'production'
	miniprogram?: string
	description?: string
}
/**
 * gitm build-mp
 */
program
	.name('gitm build-mp')
	.usage(
		'[project] [-e --env [env]] [--api-env [apiEnv]] [-mp --miniprogram [miniprogram]] [-des --description [description]] [-a --app [app]] [-d --data <data>] [-c --confirm]'
	)
	.description(t('buildMpJenkins'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
	program.option(o.flags, o.description, o.defaultValue)
})
// .option('-e, --env [env]', t('Environment to be built, optionally dev, prod, bug, all'), '')
// .option('--api-env [apiEnv]', t('Api environment to be built, optionally alpha, tag, release, production'), '')
// .option('-mp, --miniprogram [miniprogram]', t('Generate experiential version of miniprogram'), '')
// .option('-des, --description [description]', t('Enter the version description'), '')
// .option('-a, --app [app]', t('Application to be built'), '')
// .option('-d, --data <data>', t('Other data to be transferred'), '{}')
// .option('-c, --confirm', t('Confirm start, do not show confirmation box when true'), false)
program.action(async (project: string, opt: GitmBuildMpOption): Promise<void> => {
	const data = JSON.parse(opt.data || '{}')
	let env = opt.env,
		app = opt.app,
		_confirm = opt.confirm,
		build_api_env = opt.build_api_env || data.build_api_env,
		mini_program = opt.miniprogram || data.mini_program,
		description = opt.description || data.description

	if (!project) {
		if (getIsGitProject()) project = getGitConfig().appName
		else
			project = await input({
				message: t('Enter project name'),
				transformer: val => val.trim()
			})
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
				})
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

	if (!build_api_env) {
		;[, build_api_env] = await to(
			select({
				message: t('Select the api environment to build'),
				choices: [
					{
						name: 'alpha',
						value: 'alpha',
						description: t('Test environment(alpha)')
					},
					{
						name: 'tag',
						value: 'tag',
						description: t('Pre-release tag environment(bug)')
					},
					{
						name: 'release',
						value: 'release',
						description: t('Pre-release prod environment(prod)')
					},
					{
						name: 'production',
						value: 'production',
						description: t('Production environment')
					}
				]
			})
		)
	}

	if (!mini_program) {
		;[, mini_program] = await to(
			input({
				message: t('Generate experiential version of miniprogram'),
				transformer: val => val.trim()
			})
		)
	}
	if (!description) {
		;[, description] = await to(
			input({
				message: t('Enter the version description'),
				transformer: val => val.trim()
			})
		)
	}

	if (!_confirm) {
		let message = `${yellow(t('Please double check the following build parameters'))}\n${t(
			'Project Name'
		)}: ${red(project)}\n${t('Code Branch')}: ${red(env)}\n${t('Build Application')}: ${red(
			app
		)}`

		message += `\n${t('Interface Environment')}: ${red(build_api_env || 'production')}`
		if (mini_program)
			message += `\n${t('Experience version pushed to')}: ${red(mini_program || t('Push to templates only'))}`
		if (description) message += `\n${t('Version Description')}: ${red(description)}`
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
			data: JSON.stringify({ ...data, build_api_env, mini_program, description })
		})
})
program.parse(process.argv)
export {}
