#!/usr/bin/env ts-node
const { program } = require('commander')
const sh = require('shelljs')
const { yellow, red } = require('colors')
const { options, args } = require('./conf/suggest')
const { queue } = require('./core/queue')
const { getIsGitProject, getCurrentBranch } = require('./core/git/index')
const { createArgs } = require('./core/utils/index')
if (!getIsGitProject()) {
    sh.echo(red('当前目录不是git项目目录'))
    process.exit(1)
}

import { GitmarsOptionOptionsType } from '../typings'

interface GitmBuildOption {
    keep?: boolean
}

/**
 * gitm suggest
 */
program
    .name('gitm suggest')
    .usage('[message] [index] [-k --keep [keep]]')
    .description('恢复暂存区文件')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-k, --keep [keep]', '保留暂存区不删除', false)
program.action((message: string, index: string, opt: GitmBuildOption) => {})
program.parse(process.argv)
export {}
