#!/usr/bin/env ts-node
const { program } = require('commander')
const sh = require('shelljs')
const { red } = require('colors')
const { options, args } = require('./conf/log')
const { getIsGitProject, getGitLogs } = require('./core/git/index')
const { createArgs } = require('./core/utils/index')
if (!getIsGitProject()) {
    sh.echo(red('当前目录不是git项目目录'))
    process.exit(1)
}

import { GitmarsOptionOptionsType } from '../typings'

interface GitmBuildOption {
    lastet?: string
    limit?: number
    merges?: boolean
}

/**
 * gitm log
 */
program
    .name('gitm log')
    .usage('[branch] [--lastet [lastet]] [--limit [limit]] [--no-merges]')
    .description('日志查询')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('--lastet [lastet]', '查询在某个时间之后的日志，填写格式：10s/2m/2h/3d/4M/5y', '7d')
// .option('--no-merges', '是否排除merge的日志')
// .option('--limit [limit]', '最多查询的日志条数', 20)
program.action(async (branch: string, opt: GitmBuildOption) => {
    const logs = getGitLogs({
        lastet: opt.lastet,
        limit: opt.limit,
        branch,
        noMerges: !opt.merges
    })
    console.info(logs)
    process.exit(0)
})
program.parse(process.argv)
export {}
