#!/usr/bin/env ts-node
import type { CommandType, GitmarsOptionOptionsType } from '../typings'
const { program } = require('commander')
const sh = require('shelljs')
const { yellow, red } = require('chalk')
const { queue } = require('@gitmars/core/lib/queue')
const getIsGitProject = require('@gitmars/core/lib/git/getIsGitProject')
const { createArgs } = require('@gitmars/core/lib/utils/command')
const { options, args } = require('./conf/revert')
if (!getIsGitProject()) {
    sh.echo(red('当前目录不是git项目目录'))
    process.exit(1)
}
interface GitmBuildOption {
    number?: number
    mode?: 1 | 2 | ''
}

/**
 * gitm revert
 */
program
    .name('gitm revert')
    .usage('[commitid] [-n --number [number]] [-m --mode [mode]]')
    .description('撤销一次提交记录')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .arguments('[commitid]')
// .option('-n, --number [number]', '撤销最后一次提交（或者撤销倒数第n次提交）', '')
// .option('-m, --mode [mode]', '针对撤销一次merge记录，需要传入类型：1 = 保留当前分支代码，2 = 保留传入代码', '')
program.action((commitid: string, opt: GitmBuildOption) => {
    const cmd: Array<CommandType | string> = []
    let n = 'HEAD',
        m = ''
    if (opt.mode) m = ' -m ' + Math.abs(Number(opt.mode))
    if (opt.number) {
        const num = Math.abs(Number(opt.number))
        if (num > 1) n += '~' + (num - 1)
        cmd.push({
            cmd: `git revert ${n}${m}`,
            config: {
                again: true,
                success: '撤销成功',
                fail: '出错了，请根据提示处理'
            }
        })
    } else if (commitid) {
        cmd.push({
            cmd: `git revert ${commitid}${m}`,
            config: {
                again: true,
                success: '撤销成功',
                fail: '出错了，请根据提示处理'
            }
        })
    } else {
        sh.echo(yellow('指令不合法'))
        process.exit(1)
    }
    queue(cmd)
})
program.parse(process.argv)
export {}
