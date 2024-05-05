#!/usr/bin/env ts-node
import { program } from 'commander'
import { createArgs } from '@gitmars/utils'
import { run } from '@gitmars/hook'
import type { GitmarsOptionOptionsType } from './types'
import lang from './common/local'
import runConfig from './conf/run'

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
