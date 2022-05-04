#!/usr/bin/env ts-node
import type { GitmarsOptionOptionsType } from '../typings'
const { program } = require('commander')
const { createArgs } = require('@gitmars/core/lib/utils/command')
const run = require('@gitmars/core/lib/hook/run')
const { options, args } = require('./conf/run')

type GitmBuildOption = Record<string, string>

/**
 * gitm run
 */
program
    .name('gitm run')
    .usage('[command] [args...]')
    .description('git钩子运行指令')
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
