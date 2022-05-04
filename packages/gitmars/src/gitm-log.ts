#!/usr/bin/env ts-node
import type { GitLogsType, GitmarsOptionOptionsType } from '../typings'
const { program } = require('commander')
const dayjs = require('dayjs')
const columnify = require('columnify')
const { red, green, cyan, blue, yellow } = require('colors')
const getIsGitProject = require('@gitmars/core/lib/git/getIsGitProject')
const getGitLogs = require('@gitmars/core/lib/git/getGitLogs')
const { createArgs } = require('@gitmars/core/lib/utils/command')
const echo = require('@gitmars/core/lib/utils/echo')
const { options, args } = require('./conf/log')
if (!getIsGitProject()) {
    echo(red('当前目录不是git项目目录'))
    process.exit(1)
}
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
    .description('日志查询')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('--lastet [lastet]', '查询在某个时间之后的日志，填写格式：10s/2m/2h/3d/4M/5y', '7d')
// .option('--no-merges', '是否排除merge的日志')
// .option('--limit [limit]', '最多查询的日志条数', 20)
// .option('--json', '是否以json格式输出日志，默认表格方式', false)
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
