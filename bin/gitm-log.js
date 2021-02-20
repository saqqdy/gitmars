#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { options, args } = require('./conf/log')
const { queue, success, getLogs, createArgs } = require('./js/index')
/**
 * gitm log
 */
program.name('gitm log').usage('[branche]').description('日志查询')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach(o => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('--lastet [lastet]', '查询在某个时间之后的日志，填写格式：10s/2m/2h/3d/4M/5y', '7d')
// .option('--limit [limit]', '最多查询的日志条数', 20)
program.action(async (branche, opt) => {
    const logs = getLogs({
        lastet: opt.lastet,
        limit: opt.limit,
        branches: branche
    })
    console.log(logs)
    sh.exit(1)
})
program.parse(process.argv)
