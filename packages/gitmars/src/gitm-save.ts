#!/usr/bin/env ts-node
import { program } from 'commander'
import sh from 'shelljs'
import chalk from 'chalk'
import { queue } from '@gitmars/core/lib/queue'
import getIsGitProject from '@gitmars/core/lib/git/getIsGitProject'
import getCurrentBranch from '@gitmars/core/lib/git/getCurrentBranch'
import { createArgs } from '@gitmars/core/lib/utils/command'
import type { CommandType, GitmarsOptionOptionsType } from '../typings'
import lang from '#lib/common/local'
import saveConfig from '#lib/conf/save'

const { t } = lang
const { red } = chalk
const { args, options } = saveConfig

if (!getIsGitProject()) {
    sh.echo(red(t('The current directory is not a git project directory')))
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
    .description(t('Staging current branch files'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-f, --force', t('No version of the file is also staged, which will perform a git add .'), false)
program.action((message: string, opt: GitmBuildOption) => {
    if (!message) message = getCurrentBranch()
    message = `${message}_cache_by_gitmars`
    let cmd: Array<CommandType | string> = [
        {
            cmd: `git stash save "${message}"`,
            config: {
                success: t('File staging successful'),
                fail: t('There was an error, please contact an administrator')
            }
        }
    ]
    if (opt.force) {
        cmd = [
            'git add .',
            {
                cmd: `git stash save "${message}"`,
                config: {
                    success: t('File staging successful'),
                    fail: t(
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
