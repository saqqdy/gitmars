#!/usr/bin/env ts-node
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { GitmarsOptionOptionsType } from '../typings'
const { program } = require('commander')
const sh = require('shelljs')
const { yellow, red } = require('colors')
const { queue } = require('@gitmars/core/lib/queue')
const {
    getIsGitProject,
    getCurrentBranch
} = require('@gitmars/core/lib/git/index')
const { createArgs } = require('@gitmars/core/lib/utils/index')
const { options, args } = require('./conf/suggest')
if (!getIsGitProject()) {
    sh.echo(red('当前目录不是git项目目录'))
    process.exit(1)
}
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
