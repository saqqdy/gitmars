#!/usr/bin/env ts-node
import { program } from 'commander'
import sh from 'shelljs'
import inquirer from 'inquirer'
import chalk from 'chalk'
import { createArgs } from '@gitmars/utils'
import { runJenkins } from '@gitmars/build'
import { type ApolloBranchList } from '@gitmars/build'
import type { GitmarsOptionOptionsType } from '../types'
import lang from './common/local'
import buildConfig from './conf/build'

const { t } = lang
const { red, yellow } = chalk
const { args, options } = buildConfig

interface GitmBuildOption {
	env: ApolloBranchList
	app: string
	data?: string
	confirm?: boolean
}
/**
 * gitm build
 */
program
	.name('gitm build')
	.usage('<project> [-e --env [env]] [-a --app [app]] [-d --data <data>] [-c --confirm]')
	.description(t('buildJenkins'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
	program.option(o.flags, o.description, o.defaultValue)
})
// .option('-e, --env [env]', t('Environment to be built, optionally dev, prod, bug, all'), 'dev')
// .option('-a, --app [app]', t('Application to be built'), 'all')
// .option('-d, --data <data>', t('Other data to be transferred'), '{}')
// .option('-c, --confirm', t('Confirm start, do not show confirmation box when true'), false)
program.action(async (project: string, opt: GitmBuildOption): Promise<void> => {
	const data = JSON.parse(opt.data || '{}')
	let confirm = opt.confirm

	// 有opt.data时强制确认
	if (!confirm || (opt.data && opt.data !== '{}')) {
		let message = `${yellow(t('Please double check the following build parameters'))}\n${t(
			'Project Name'
		)}: ${red(project)}\n${t('Code Branch')}: ${red(opt.env)}\n${t('Build Application')}: ${red(
			opt.app
		)}`

		message += `\n${t('Interface Environment')}: ${red(data.build_api_env || 'production')}`
		if ('mini_program' in data)
			message += `\n${t('Experience version pushed to')}: ${red(data.mini_program || t('Push to templates only'))}`
		if ('description' in data)
			message += `\n${t('Version Description')}: ${red(data.description)}`
		if ('clean' in data)
			message += `\n${t('Clean node modules (use with caution)')}: ${red(data.clean)}`

		confirm = (
			await inquirer.prompt({
				type: 'confirm',
				name: 'confirm',
				message
			})
		).confirm
	}

	if (!confirm) sh.exit(1)
	else
		runJenkins({
			env: opt.env,
			project,
			app: opt.app,
			data: opt.data
		})
})
program.parse(process.argv)
export {}
