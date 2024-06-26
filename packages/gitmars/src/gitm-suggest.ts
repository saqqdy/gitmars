#!/usr/bin/env ts-node
/* eslint-disable @typescript-eslint/no-unused-vars */
import { program } from 'commander'
import sh from 'shelljs'
import chalk from 'chalk'
import { createArgs } from '@gitmars/utils'
import { getIsGitProject } from '@gitmars/git'
import type { GitmarsOptionOptionsType } from './types'
import lang from './common/local'
import suggestConfig from './conf/suggest'

const { t } = lang
const { red } = chalk
const { args, options } = suggestConfig

if (!getIsGitProject()) {
	sh.echo(red(t('The current directory is not a git project directory')))
	process.exit(1)
}

interface GitmSuggestOption {
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
program.action((message: string, index: string, opt: GitmSuggestOption) => {})
program.parse(process.argv)
export {}
