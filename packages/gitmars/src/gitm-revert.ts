#!/usr/bin/env ts-node
import { program } from 'commander'
import sh from 'shelljs'
import { red, yellow } from 'chalk'
import { queue } from '@gitmars/core/lib/queue'
import getIsGitProject from '@gitmars/core/lib/git/getIsGitProject'
import { createArgs } from '@gitmars/core/lib/utils/command'
import type { CommandType, GitmarsOptionOptionsType } from '../typings'
import revertConfig from './conf/revert'
import i18n from './locales'

if (!getIsGitProject()) {
    sh.echo(
        red(i18n.__('The current directory is not a git project directory'))
    )
    process.exit(1)
}

const { args, options } = revertConfig

interface GitmBuildOption {
    number?: number
    mode?: 1 | 2 | ''
}

/**
 * gitm revert
 */
program
    .name('gitm revert')
    .usage('[commitid] [-n --number [number]] [-m --mode [mode]]')
    .description(i18n.__('Undo a commit record'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .arguments('[commitid]')
// .option('-n, --number [number]', i18n.__('Undo the last commit (or undo the penultimate nth commit)'), '')
// .option('-m, --mode [mode]', i18n.__('For undoing a merge record, the type to be passed in: 1 = keep current branch code, 2 = keep incoming code'), '')
program.action((commitid: string, opt: GitmBuildOption) => {
    const cmd: Array<CommandType | string> = []
    let n = 'HEAD',
        m = ''
    if (opt.mode) m = ' -m ' + Math.abs(Number(opt.mode))
    if (opt.number) {
        const num = Math.abs(Number(opt.number))
        if (num > 1) n += '~' + (num - 1)
        cmd.push({
            cmd: `git revert ${n}${m}`,
            config: {
                again: true,
                success: i18n.__('Successfully reverted'),
                fail: i18n.__(
                    'An error has occurred, please follow the instructions'
                )
            }
        })
    } else if (commitid) {
        cmd.push({
            cmd: `git revert ${commitid}${m}`,
            config: {
                again: true,
                success: i18n.__('Successfully reverted'),
                fail: i18n.__(
                    'An error has occurred, please follow the instructions'
                )
            }
        })
    } else {
        sh.echo(yellow(i18n.__('Commands do not meet the specifications')))
        process.exit(1)
    }
    queue(cmd)
})
program.parse(process.argv)
export {}
