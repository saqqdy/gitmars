#!/usr/bin/env ts-node
import type { CommandType, GitmarsOptionOptionsType } from '../typings'
const { program } = require('commander')
const sh = require('shelljs')
const { red } = require('chalk')
const { queue } = require('@gitmars/core/lib/queue')
const getIsGitProject = require('@gitmars/core/lib/git/getIsGitProject')
const getCurrentBranch = require('@gitmars/core/lib/git/getCurrentBranch')
const { createArgs } = require('@gitmars/core/lib/utils/command')
const { options, args } = require('./conf/save')
const i18n = require('./locales')
if (!getIsGitProject()) {
    sh.echo(
        red(i18n.__('The current directory is not a git project directory'))
    )
    process.exit(1)
}
interface GitmBuildOption {
    force?: boolean
}

/**
 * gitm save
 */
program
    .name('gitm save')
    .usage('[message] [-f --force]')
    .description(i18n.__('Staging current branch files'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-f, --force', i18n.__('No version of the file is also staged, which will perform a git add .'), false)
program.action((message: string, opt: GitmBuildOption) => {
    if (!message) message = getCurrentBranch()
    message = `${message}_cache_by_gitmars`
    let cmd: Array<CommandType | string> = [
        {
            cmd: `git stash save "${message}"`,
            config: {
                success: i18n.__('File staging successful'),
                fail: '出错了，请联系管理员'
            }
        }
    ]
    if (opt.force) {
        cmd = [
            'git add .',
            {
                cmd: `git stash save "${message}"`,
                config: {
                    success: i18n.__('File staging successful'),
                    fail: '出错了，请联系管理员'
                }
            }
        ]
    }
    queue(cmd)
})
program.parse(process.argv)
export {}
