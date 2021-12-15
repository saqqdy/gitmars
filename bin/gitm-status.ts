#!/usr/bin/env ts-node
const { program } = require('commander')
const columnify = require('columnify')
const { yellow, red, cyan, green } = require('colors')
const { options, args } = require('./conf/status')
const getIsGitProject = require('./core/git/getIsGitProject')
const getCurrentBranch = require('./core/git/getCurrentBranch')
const getGitStatus = require('./core/git/getGitStatus')
const { createArgs } = require('./core/utils/command')
const echo = require('./core/utils/echo')
if (!getIsGitProject()) {
    echo(red('当前目录不是git项目目录'))
    process.exit(1)
}

import { GitmarsOptionOptionsType, GitStatusInfoType } from '../typings'

/**
 * gitm status
 */
program
    .name('gitm status')
    .usage('[-k --keep [keep]]')
    .description('恢复暂存区文件')
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
        status['A'].length,
        status['M'].length,
        status['D'].length,
        status['UU'].length
    )
    while (num--) {
        data.unshift({
            added: yellow(status['A'][num] || ''),
            modified: green(status['M'][num] || ''),
            deleted: red(status['D'][num] || ''),
            unmerged: red(status['UU']),
            untracked: cyan(status['??'][num] || '')
        })
    }
    echo(green(`当前分支：${current}\n`))
    echo(columnify(data))
})
program.parse(process.argv)
export {}
