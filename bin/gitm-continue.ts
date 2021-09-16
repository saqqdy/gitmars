#!/usr/bin/env ts-node
const { program } = require('commander')
const sh = require('shelljs')
const { options, args } = require('./conf/continue')
const { error, queue, getCache, isGitProject } = require('./js/index')
const { createArgs } = require('./js/tools')
if (!isGitProject()) {
    sh.echo(error('当前目录不是git项目目录'))
    sh.exit(1)
}

import { GitmarsOptionOptionsType, CommandType } from '../typings'

interface GitmBuildOption {
    list: boolean
}

/**
 * gitm continue
 */
program.name('gitm continue').usage('[-l --list]').description('继续未完成的操作')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-l, --list', '显示指令队列', false)
program.action((opt: GitmBuildOption) => {
    const cmd: Array<CommandType | string> = getCache()
    if (opt.list) {
        sh.echo(cmd)
        sh.exit(0)
    }
    if (cmd.length > 0) {
        queue(cmd)
    } else {
        sh.echo(error('队列里面没有未执行的指令'))
    }
})
program.parse(process.argv)
export {}
