#!/usr/bin/env ts-node
const { program } = require('commander')
const { options, args } = require('./conf/run')
const { createArgs } = require('./js/tools')
const run = require('./js/hook/run')

import { GitmarsOptionOptionsType } from '../typings'

interface GitmBuildOption {
    [props: string]: string
}

/**
 * gitm run
 */
program.name('gitm run').usage('[command]').description('git钩子运行指令')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .arguments('[command] [args...]')
program.action((command: string, args: string[], opt: GitmBuildOption) => {
    run(command, args, opt)
})
program.parse(process.argv)
export {}
