#!/usr/bin/env ts-node
import { program } from 'commander'
import sh from 'shelljs'
import chalk from 'chalk'
import inquirer from 'inquirer'
import getGitRevParse from '@gitmars/core/lib/git/getGitRevParse'
import getIsGitProject from '@gitmars/core/lib/git/getIsGitProject'
import { removeFile } from '@gitmars/core/lib/utils/file'
import { createArgs } from '@gitmars/core/lib/utils/command'
import { cleanCache } from '@gitmars/core/lib/cache/cache'
import { cleanPkgInfo } from '@gitmars/core/lib/utils/pkgInfo'
import { cleanBuildConfig } from '@gitmars/core/lib/build/buildConfig'
import type { GitmarsOptionOptionsType } from '../typings/gitmars'
import lang from '#lib/common/local'
import cleanConfig from '#lib/conf/clean'

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
