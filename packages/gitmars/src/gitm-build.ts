#!/usr/bin/env ts-node
import { program } from 'commander'
import { createArgs } from '@gitmars/core/lib/utils/command'
import runJenkins from '@gitmars/core/lib/build/runJenkins'
import type { GitmarsOptionOptionsType } from '../typings'
import buildConfig from './conf/build'
import i18n from './locales'

const { args, options } = buildConfig

interface GitmBuildOption {
    env?: string
    app?: string
}
/**
 * gitm build
 */
program
    .name('gitm build')
    .usage('<project> [-e --env [env]] [-a --app [app]]')
    .description(i18n.__('buildJenkins'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-e, --env [env]', '需要构建的环境，可选dev、prod、bug、all', 'dev')
// .option('-a, --app [app]', '需要构建的应用', 'all')
program.action((project: string, opt: GitmBuildOption): void => {
    runJenkins({
        env: opt.env,
        project,
        app: opt.app
    })
})
program.parse(process.argv)
export {}
