#!/usr/bin/env ts-node
/* eslint-disable @typescript-eslint/no-unused-vars */
import { program } from 'commander'
import sh from 'shelljs'
import chalk from 'chalk'
import { queue } from '@gitmars/core/lib/queue'
import { createArgs } from '@gitmars/core/lib/utils/index'
import { getCurrentBranch, getIsGitProject } from '@gitmars/core/lib/git/index'
import type { GitmarsOptionOptionsType } from '../typings'
import suggestConfig from '#lib/conf/suggest'
import i18n from '#lib/locales/index'

const { red, yellow } = chalk
const { args, options } = suggestConfig

if (!getIsGitProject()) {
    sh.echo(
        red(i18n.__('The current directory is not a git project directory'))
    )
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
    .description(i18n.__('Suggestions for operation'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-k, --keep [keep]', i18n.__('Keep staging area not deleted'), false)
program.action((message: string, index: string, opt: GitmBuildOption) => {})
program.parse(process.argv)
export {}
