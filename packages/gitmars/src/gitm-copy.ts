#!/usr/bin/env ts-node
import { program } from 'commander'
import sh from 'shelljs'
import chalk from 'chalk'
import { queue } from '@gitmars/core/lib/queue'
import getIsGitProject from '@gitmars/core/lib/git/getIsGitProject'
import getCurrentBranch from '@gitmars/core/lib/git/getCurrentBranch'
import checkGitStatus from '@gitmars/core/lib/git/checkGitStatus'
import { createArgs } from '@gitmars/core/lib/utils/command'
import type {
    CommandType,
    GitmarsOptionOptionsType,
    QueueReturnsType
} from '../typings'
import copyConfig from '#lib/conf/copy'
import i18n from '#lib/locales/index'

const { red, yellow } = chalk
const { args, options } = copyConfig

if (!getIsGitProject()) {
    sh.echo(
        red(i18n.__('The current directory is not a git project directory'))
    )
    process.exit(1)
}

interface GitmBuildOption {
    source?: string
    key?: string
    author?: string
}

/**
 * gitm copy
 */
program
    .name('gitm copy')
    .usage(
        '[commitid...] [-t --target [target]] [-k --key [keyword]] [-a --author [author]]'
    )
    .description(
        i18n.__(
            'cherry-pick batch version, copy a record from a branch and merge it into the current branch'
        )
    )
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-s, --source [source]', i18n.__('Copy the source branch of the record'), '')
// .option('-k, --key [keyword]', i18n.__('Fuzzy search for commit message keywords'), '')
// .option('-a, --author [author]', i18n.__('Submitter'), '')
program.action((commitid: string[], opts: GitmBuildOption) => {
    const status = checkGitStatus()
    const cur = getCurrentBranch()
    if (!status) process.exit(1)
    if (commitid.length > 0) {
        const cmd: Array<CommandType | string> = [
            {
                cmd: `git cherry-pick ${commitid.join(' ')}`,
                config: {
                    again: false,
                    success: i18n.__('Record merge successful'),
                    fail: i18n.__(
                        'Merge failed, please follow the instructions'
                    )
                }
            }
        ]
        queue(cmd)
    } else if (!opts.key) {
        sh.echo(i18n.__('Please fill in the keyword'))
        process.exit(1)
    } else if (!opts.source) {
        sh.echo(i18n.__('Please fill in the source branch'))
        process.exit(1)
    } else {
        if (opts.key.length < 3) {
            sh.echo(
                yellow(
                    i18n.__(
                        'To make sure the copy is accurate, the keywords cannot be less than 4 words, please try to fill in the keywords completely'
                    )
                )
            )
            process.exit(1)
        }
        const cmd: Array<CommandType | string> = [
            `git checkout ${opts.source}`,
            `git log --grep=${opts.key} --author=${opts.author} --no-merges`
        ]
        // if (!/^\d{4,}$/.test(opts.key)) {
        // 	sh.echo(red(i18n.__('To ensure accurate copy, the keyword must be a task number or bug fix number with more than 4 digits')))
        // 	process.exit(1)
        // }
        queue(cmd).then((data: QueueReturnsType[]) => {
            const commits: string[] = []
            if (data[1].status === 0) {
                const logs =
                    data[1].stdout.match(/(commit\s[a-z0-9]*\n+)/g) || []
                let cmds: Array<CommandType | string> = [`git checkout ${cur}`]
                logs.forEach(el => {
                    commits.push(el.replace(/(commit\s)|\n/g, ''))
                })
                commits.reverse()
                if (commits.length > 0) {
                    cmds = cmds.concat([
                        {
                            cmd: `git cherry-pick ${commits.join(' ')}`,
                            config: {
                                again: false,
                                success: i18n.__('Record merge successful'),
                                fail: i18n.__(
                                    'Merge failed, please follow the instructions'
                                )
                            }
                        }
                    ])
                } else {
                    sh.echo(i18n.__('No records found'))
                }
                queue(cmds)
            } else {
                sh.echo(data[1].stderr)
            }
        })
    }
})
program.parse(process.argv)
export {}
