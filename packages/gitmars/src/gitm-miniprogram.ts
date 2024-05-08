#!/usr/bin/env ts-node
import { program } from 'commander'
// import sh from 'shelljs'
import { confirm, input, select } from '@inquirer/prompts'
// import chalk from 'chalk'
import to from 'await-to-done'
import { createArgs, printQrcode } from '@gitmars/utils'
import { getAuthorizerListWithAllDetail, getPreAuthQrCode } from '@gitmars/api'
// import { getGitConfig, getIsGitProject } from '@gitmars/git'
// import { getBuildConfig, getProjectOption, runJenkins } from '@gitmars/build'
// import type { ApolloBranchList } from '@gitmars/build'
import type { GitmarsOptionOptionsType } from './types'
import lang from './common/local'
import miniprogramConfig from './conf/miniprogram'

const { t } = lang
// const { red, yellow } = chalk
const { args, options } = miniprogramConfig

interface GitmMiniprogramOption {
	// env?: ApolloBranchList
	// app?: string
	// data?: string
	// confirm?: boolean
	// build_api_env?: 'alpha' | 'tag' | 'release' | 'production'
	// miniprogram?: string
	// description?: string
}
/**
 * gitm miniprogram
 */
program
	.name('gitm miniprogram')
	.usage(
		'[miniprogram] [-e --env [env]] [--api-env [apiEnv]] [-mp --miniprogram [miniprogram]] [-des --description [description]] [-a --app [app]] [-d --data <data>] [-c --confirm]'
	)
	.description(t('miniprogram command'))
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
program.action(async (miniprogram: string, opt: GitmMiniprogramOption): Promise<void> => {
	if (miniprogram === 'auth') {
		// get auth qrcode
		const authUrl = await getPreAuthQrCode()
		await printQrcode(authUrl)
	} else if (!miniprogram) {
		const { list } = await getAuthorizerListWithAllDetail({ limit: -1 })
		;[, miniprogram = ''] = await to(
			select<string>({
				message: t('Select the application to build'),
				choices: list.map(({ authorizer_info: info, authorizer_appid }) => ({
					name: info.nick_name,
					value: authorizer_appid
				}))
			})
		)
	}

	console.log(1001, miniprogram, opt)
})
program.parse(process.argv)
export {}
