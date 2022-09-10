#!/usr/bin/env ts-node
import { program } from 'commander'
import sh from 'shelljs'
import chalk from 'chalk'
import { queue } from '@gitmars/core/lib/queue'
import getIsGitProject from '@gitmars/core/lib/git/getIsGitProject'
import getCurrentBranch from '@gitmars/core/lib/git/getCurrentBranch'
import { createArgs } from '@gitmars/core/lib/utils/command'
import type { CommandType, GitmarsOptionOptionsType } from '../typings'
import saveConfig from '#lib/conf/save'
import i18n from '#lib/locales/index'

const { red } = chalk
const { args, options } = saveConfig

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
                fail: i18n.__(
                    'There was an error, please contact an administrator'
                )
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
                    fail: i18n.__(
                        'There was an error, please contact an administrator'
                    )
                }
            }
        ]
    }
    queue(cmd)
})
program.parse(process.argv)
export {}
