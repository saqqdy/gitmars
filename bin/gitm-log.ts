#!/usr/bin/env ts-node
const { program } = require('commander')
const sh = require('shelljs')
sh.config.execPath = sh.which('node').toString()
const { options, args } = require('./conf/log')
const { error, getLogs, isGitProject } = require('./js/index')
const { createArgs } = require('./js/tools')
if (!isGitProject()) {
    sh.echo(error('当前目录不是git项目目录'))
    sh.exit(1)
}

import { GitmarsOptionOptionsType } from '../typings'

interface GitmBuildOption {
    lastet?: string
    limit?: number
}

/**
 * gitm log
 */
program
    .name('gitm log')
    .usage('[branche] [--lastet [lastet]] [--limit [limit]]')
    .description('日志查询')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('--lastet [lastet]', '查询在某个时间之后的日志，填写格式：10s/2m/2h/3d/4M/5y', '7d')
// .option('--limit [limit]', '最多查询的日志条数', 20)
program.action(async (branche: string, opt: GitmBuildOption) => {
    const logs = getLogs({
        lastet: opt.lastet,
        limit: opt.limit,
        branches: branche
    })
    console.log(logs)
    sh.exit(1)
})
program.parse(process.argv)
export {}
