#!/usr/bin/env ts-node
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { GitmarsOptionOptionsType } from '../typings'
const { program } = require('commander')
const sh = require('shelljs')
const { yellow, red } = require('chalk')
const { queue } = require('@gitmars/core/lib/queue')
const {
    getIsGitProject,
    getCurrentBranch
} = require('@gitmars/core/lib/git/index')
const { createArgs } = require('@gitmars/core/lib/utils/index')
const { options, args } = require('./conf/suggest')
const i18n = require('./locales')
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
