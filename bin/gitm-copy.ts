#!/usr/bin/env ts-node
const { program } = require('commander')
const sh = require('shelljs')
const { yellow, red } = require('colors')
const { options, args } = require('./conf/copy')
const { queue } = require('./core/queue')
const {
    getIsGitProject,
    getCurrentBranch,
    checkGitStatus
} = require('./core/git/index')
const { createArgs } = require('./core/utils/index')
if (!getIsGitProject()) {
    sh.echo(red('当前目录不是git项目目录'))
    process.exit(1)
}

import {
    QueueReturnsType,
    GitmarsOptionOptionsType,
    CommandType
} from '../typings'

interface GitmBuildOption {
    source?: string
    key?: string
    author?: string
}

/**
 * gitm copy
 */
program
    .name('gitm copy')
    .usage(
        '[commitid...] [-t --target [target]] [-k --key [keyword]] [-a --author [author]]'
    )
    .description('cherry-pick批量版本，从某个分支拷贝某条记录合并到当前分支')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-s, --source [source]', '拷贝记录的来源分支', '')
// .option('-k, --key [keyword]', '模糊搜索commit信息关键词', '')
// .option('-a, --author [author]', '提交者', '')
program.action((commitid: string[], opts: GitmBuildOption) => {
    const status = checkGitStatus()
    const cur = getCurrentBranch()
    if (!status) process.exit(1)
    if (commitid.length > 0) {
        const cmd: Array<CommandType | string> = [
            {
                cmd: `git cherry-pick ${commitid.join(' ')}`,
                config: {
                    again: false,
                    success: '记录合并成功',
                    fail: '合并失败，请根据提示处理'
                }
            }
        ]
        queue(cmd)
    } else if (!opts.key) {
        sh.echo('请填写关键词')
        process.exit(1)
    } else if (!opts.source) {
        sh.echo('请填写源分支')
        process.exit(1)
    } else {
        if (opts.key.length < 3) {
            sh.echo(
                yellow(
                    '为确保copy准确，关键词不能少于4个字，请尽量完整填写关键词'
                )
            )
            process.exit(1)
        }
        const cmd: Array<CommandType | string> = [
            `git checkout ${opts.source}`,
            `git log --grep=${opts.key} --author=${opts.author} --no-merges`
        ]
        // if (!/^\d{4,}$/.test(opts.key)) {
        // 	sh.echo(red('为确保copy准确，关键词必须是4位以上的任务号或者bug修复编号'))
        // 	process.exit(1)
        // }
        queue(cmd).then((data: QueueReturnsType[]) => {
            const commits: string[] = []
            if (data[1].status === 0) {
                const logs =
                    data[1].stdout.match(/(commit\s[a-z0-9]*\n+)/g) || []
                let cmds: Array<CommandType | string> = [`git checkout ${cur}`]
                logs.forEach(el => {
                    commits.push(el.replace(/(commit\s)|\n/g, ''))
                })
                commits.reverse()
                if (commits.length > 0) {
                    cmds = cmds.concat([
                        {
                            cmd: `git cherry-pick ${commits.join(' ')}`,
                            config: {
                                again: false,
                                success: '记录合并成功',
                                fail: '合并失败，请根据提示处理'
                            }
                        }
                    ])
                } else {
                    sh.echo('没有找到任何记录')
                }
                queue(cmds)
            } else {
                sh.echo(data[1].stderr)
            }
        })
    }
})
program.parse(process.argv)
export {}
