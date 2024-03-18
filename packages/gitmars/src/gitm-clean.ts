#!/usr/bin/env ts-node
import { program } from 'commander'
import sh from 'shelljs'
import chalk from 'chalk'
import inquirer from 'inquirer'
import { getGitRevParse, getIsGitProject } from '@gitmars/git'
import { cleanPkgInfo, createArgs, removeFile } from '@gitmars/utils'
import { cleanCache } from '@gitmars/cache'
import { cleanBuildConfig } from '@gitmars/build'
import type { GitmarsOptionOptionsType } from './types'
import lang from './common/local'
import cleanConfig from './conf/clean'

sh.config.silent = true

const { t } = lang
const { green, yellow } = chalk
const { args, options } = cleanConfig
const { gitDir } = getGitRevParse()

interface GitmBuildOption {
	force?: string
}

/**
 * gitm clean
 */
program.name('gitm clean').usage('[-f --force]').description(t('Clean gitmars cache'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
	program.option(o.flags, o.description, o.defaultValue)
})
// .option('-f, --force', t('Force cleanup'), false)
program.action(async (opt: GitmBuildOption) => {
	if (getIsGitProject()) {
		if (opt.force) {
			await inquirer
				.prompt({
					type: 'confirm',
					name: 'value',
					message: t(
						'You have entered --force, which will also clear the gitmars execution cache. Should I continue?'
					),
					default: false
				})
				.then((answers: any) => {
					if (!answers.value) {
						sh.echo(green(t('exited')))
						process.exit(0)
					}
				})
			removeFile([
				{
					name: t('gitmars command queue cache file'),
					url: gitDir + '/.gitmarscommands'
				},
				{
					name: t('gitmars execution log file'),
					url: gitDir + '/.gitmarslog'
				}
			])
		}
	} else {
		sh.echo(yellow(t('The current directory is not a git project directory')))
	}
	// remove cache/buildConfig*.json cache/buildConfig.txt
	cleanBuildConfig()
	// remove cache/packageInfo.json
	cleanPkgInfo()
	// remove cache/timestamp.json
	cleanCache()
})
program.parse(process.argv)
export {}
