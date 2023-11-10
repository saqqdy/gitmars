#!/usr/bin/env ts-node
import { program } from 'commander'
import { createArgs } from '@gitmars/core/lib/utils/command'
import runJenkins from '@gitmars/core/lib/build/runJenkins'
import { type ApolloBranchList } from '@gitmars/core/typings/core'
import type { GitmarsOptionOptionsType } from '../typings/gitmars'
import lang from '#lib/common/local'
import buildConfig from '#lib/conf/build'

const { t } = lang
const { args, options } = buildConfig

interface GitmBuildOption {
	env: ApolloBranchList
	app: string
	data?: string
}
/**
 * gitm build
 */
program
	.name('gitm build')
	.usage('<project> [-e --env [env]] [-a --app [app]] [-d --data <data>]')
	.description(t('buildJenkins'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
	program.option(o.flags, o.description, o.defaultValue)
})
// .option('-e, --env [env]', t('Environment to be built, optionally dev, prod, bug, all'), 'dev')
// .option('-a, --app [app]', t('Application to be built'), 'all')
// .option('-d, --data <data>', t('Other data to be transferred'), '{}')
program.action((project: string, opt: GitmBuildOption): void => {
	runJenkins({
		env: opt.env,
		project,
		app: opt.app,
		data: opt.data
	})
})
program.parse(process.argv)
export {}
