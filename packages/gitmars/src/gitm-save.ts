#!/usr/bin/env ts-node
import type { CommandType, GitmarsOptionOptionsType } from '../typings'
const { program } = require('commander')
const sh = require('shelljs')
const { red } = require('colors')
const { queue } = require('@gitmars/core/lib/queue')
const getIsGitProject = require('@gitmars/core/lib/git/getIsGitProject')
const getCurrentBranch = require('@gitmars/core/lib/git/getCurrentBranch')
const { createArgs } = require('@gitmars/core/lib/utils/command')
const { options, args } = require('./conf/save')
if (!getIsGitProject()) {
    sh.echo(red('当前目录不是git项目目录'))
    process.exit(1)
}
interface GitmBuildOption {
    force?: boolean
}

/**
 * gitm save
 */
program
    .name('gitm save')
    .usage('[message] [-f --force]')
    .description('暂存当前分支文件')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-f, --force', '没有版本的文件也暂存，这会执行git add .', false)
program.action((message: string, opt: GitmBuildOption) => {
    if (!message) message = getCurrentBranch()
    let cmd: Array<CommandType | string> = [
        {
            cmd: `git stash save "${message}"`,
            config: { success: '文件暂存成功', fail: '出错了，请联系管理员' }
        }
    ]
    if (opt.force) {
        cmd = [
            'git add .',
            {
                cmd: `git stash save "${message}"`,
                config: {
                    success: '文件暂存成功',
                    fail: '出错了，请联系管理员'
                }
            }
        ]
    }
    queue(cmd)
})
program.parse(process.argv)
export {}
