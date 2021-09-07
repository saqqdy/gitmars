#!/usr/bin/env node
import { program } from 'commander'
import { options, args } from './conf/run'
import { createArgs } from './js/tools'
import run from './js/hook/run'

/**
 * gitm run
 */
program.name('gitm run').usage('[command]').description('git钩子运行指令')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach(o => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .arguments('[command] [args...]')
program.action((command, args, opt) => {
    run(command, args, opt)
})
program.parse(process.argv)
