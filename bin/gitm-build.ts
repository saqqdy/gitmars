#!/usr/bin/env node
import { program } from 'commander'
import { options, args } from './conf/build'
import { createArgs } from './js/tools'
import runJenkins from './js/runJenkins'
/**
 * gitm build
 */
program.name('gitm build').usage('<project>').description('构建Jenkins')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach(o => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-e, --env [env]', '需要构建的环境，可选dev、prod、bug、all', 'dev')
// .option('-a, --app [app]', '需要构建的应用', 'all')
program.action((project, opt) => {
    runJenkins({
        env: opt.env,
        project,
        app: opt.app
    })
})
program.parse(process.argv)
