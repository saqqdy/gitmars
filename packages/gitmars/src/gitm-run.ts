#!/usr/bin/env ts-node
import { program } from 'commander'
import { createArgs } from '@gitmars/core/lib/utils/command'
import run from '@gitmars/core/lib/hook/run'
import type { GitmarsOptionOptionsType } from '../typings'
import runConfig from '#lib/conf/run'
import i18n from '#lib/locales/index'

const { args, options } = runConfig

type GitmBuildOption = Record<string, string>

/**
 * gitm run
 */
program
    .name('gitm run')
    .usage('[command] [args...]')
    .description(i18n.__('git hook run command'))
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
