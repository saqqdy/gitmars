#!/usr/bin/env ts-node
/* eslint-disable @typescript-eslint/no-unused-vars */
import { program } from 'commander'
import sh from 'shelljs'
import chalk from 'chalk'
import { createArgs } from '@gitmars/core/lib/utils/command'
import getIsGitProject from '@gitmars/core/lib/git/getIsGitProject'
import type { GitmarsOptionOptionsType } from '../typings/gitmars'
import lang from '#lib/common/local'
import suggestConfig from '#lib/conf/suggest'

const { t } = lang
const { red } = chalk
const { args, options } = suggestConfig

if (!getIsGitProject()) {
	sh.echo(red(t('The current directory is not a git project directory')))
	process.exit(1)
}

interface GitmBuildOption {
	keep?: boolean
}

/**
 * gitm suggest
 */
program
	.name('gitm suggest')
	.usage('[message] [index] [-k --keep [keep]]')
	.description(t('Suggestions for operation'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
	program.option(o.flags, o.description, o.defaultValue)
})
// .option('-k, --keep [keep]', t('Keep staging area not deleted'), false)
program.action((message: string, index: string, opt: GitmBuildOption) => {})
program.parse(process.argv)
export {}
