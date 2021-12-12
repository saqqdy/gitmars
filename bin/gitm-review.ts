#!/usr/bin/env ts-node
const { program } = require('commander')
const dayjs = require('dayjs')
const inquirer = require('inquirer')
const { green, yellow, blue, red, cyan, magenta } = require('colors')
const { options, args } = require('./conf/review')
const { createArgs } = require('./core/utils/command')

import { GitmarsOptionOptionsType, InitInquirerPromptType } from '../typings'

interface GitmBuildOption {
    env?: string
    app?: string
}
/**
 * gitm review
 */
program
    .name('gitm review')
    .usage('<project> [-e --env [env]] [-a --app [app]]')
    .description('构建Jenkins')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-e, --env [env]', '需要构建的环境，可选dev、prod、bug、all', 'dev')
// .option('-a, --app [app]', '需要构建的应用', 'all')
program.action((project: string, opt: GitmBuildOption): void => {
    //
})

program.parse(process.argv)
export {}
