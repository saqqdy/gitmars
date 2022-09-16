#!/usr/bin/env ts-node
import { program } from 'commander'
import columnify from 'columnify'
import chalk from 'chalk'
import getIsGitProject from '@gitmars/core/lib/git/getIsGitProject'
import getCurrentBranch from '@gitmars/core/lib/git/getCurrentBranch'
import getGitStatus from '@gitmars/core/lib/git/getGitStatus'
import { createArgs } from '@gitmars/core/lib/utils/command'
import echo from '@gitmars/core/lib/utils/echo'
import type { GitStatusInfoType, GitmarsOptionOptionsType } from '../typings'
import statusConfig from '#lib/conf/status'
import i18n from '#lib/locales/index'

const { cyan, green, red, yellow } = chalk
const { args, options } = statusConfig

if (!getIsGitProject()) {
    echo(red(i18n.__('The current directory is not a git project directory')))
    process.exit(1)
}

/**
 * gitm status
 */
program
    .name('gitm status')
    .usage('[-k --keep [keep]]')
    .description(i18n.__('Restore staging area file'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
program.action(() => {
    const current = getCurrentBranch()
    const status: GitStatusInfoType = getGitStatus()
    const data = []
    let num = Math.max(
        status['??'].length,
        status.A.length,
        status.M.length,
        status.D.length,
        status.UU.length
    )
    while (num--) {
        data.unshift({
            added: yellow(status.A[num] || ''),
            modified: green(status.M[num] || ''),
            deleted: red(status.D[num] || ''),
            unmerged: red(status.UU),
            untracked: cyan(status['??'][num] || '')
        })
    }
    echo(
        green(
            i18n.__('Current branch: {{{something}}}', { something: current }) +
                '\n'
        )
    )
    echo(columnify(data))
})
program.parse(process.argv)
export {}
