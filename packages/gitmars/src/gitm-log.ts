#!/usr/bin/env ts-node
import { program } from 'commander'
import dayjs from 'dayjs'
import columnify from 'columnify'
import { blue, cyan, green, red, yellow } from 'chalk'
import getIsGitProject from '@gitmars/core/lib/git/getIsGitProject'
import getGitLogs from '@gitmars/core/lib/git/getGitLogs'
import { createArgs } from '@gitmars/core/lib/utils/command'
import echo from '@gitmars/core/lib/utils/echo'
import type { GitLogsType, GitmarsOptionOptionsType } from '../typings'
import logConfig from '#lib/conf/log'
import i18n from '#lib/locales/index'

if (!getIsGitProject()) {
    echo(red(i18n.__('The current directory is not a git project directory')))
    process.exit(1)
}

const { args, options } = logConfig

interface GitmBuildOption {
    lastet?: string
    limit?: number
    merges?: boolean
    json: boolean
}

/**
 * gitm log
 */
program
    .name('gitm log')
    .usage(
        '[branch] [--lastet [lastet]] [--limit [limit]] [--no-merges] [--json]'
    )
    .description(i18n.__('Log query'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('--lastet [lastet]', i18n.__('Query logs after a certain time, fill in the format: 10s/2m/2h/3d/4M/5y'), '7d')
// .option('--no-merges', '是否排除merge的日志')
// .option('--limit [limit]', i18n.__('The maximum number of logs to be queried'), 20)
// .option('--json', i18n.__('Whether to output logs in json format, default form'), false)
program.action(async (branch: string, opt: GitmBuildOption) => {
    const logs = getGitLogs({
        lastet: opt.lastet,
        limit: opt.limit,
        branch,
        noMerges: !opt.merges
    })
    if (opt.json) {
        console.info(logs)
    } else {
        const data = logs.map((log: GitLogsType) => ({
            commit: cyan(log['%h']),
            merge: cyan(log['%p']),
            title: green(log['%s']),
            // author: yellow(`${log['%an']}<${log['%ae']}>`),
            author: yellow(log['%an']),
            date: blue(dayjs(log['%aI']).format('YYYY/MM/DD HH:mm:ss'))
        }))
        echo(columnify(data))
    }
    process.exit(0)
})

program.parse(process.argv)
export {}
