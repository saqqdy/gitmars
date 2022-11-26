#!/usr/bin/env ts-node
import { program } from 'commander'
import { createArgs } from '@gitmars/core/lib/utils/command'
import run from '@gitmars/core/lib/hook/run'
import type { GitmarsOptionOptionsType } from '../typings'
import lang from '#lib/common/local'
import runConfig from '#lib/conf/run'

const { t } = lang
const { args, options } = runConfig

/**
 * gitm run
 */
program.name('gitm run').usage('[command] [args...]').description(t('git hook run command'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .arguments('[command] [args...]')
program.action((command: string, args: string[]) => {
    run(command, args)
})
program.parse(process.argv)
export {}
