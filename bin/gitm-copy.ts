#!/usr/bin/env node
const { program } = require('commander')
const sh = require('shelljs')
const { options, args } = require('./conf/copy')
const { error, warning, queue, getStatus, getCurrent, isGitProject } = require('./js/index')
const { createArgs } = require('./js/tools')
if (!isGitProject()) {
    sh.echo(error('当前目录不是git项目目录'))
    sh.exit(1)
}

import { QueueReturnsType, GitmarsOptionOptionsType, CommandType } from '../typings'

interface GitmBuildOption {
    key: string
    author: string
}

/**
 * gitm copy
 */
program.name('gitm copy').usage('<from> [commitid...] [-k] [-a]').description('cherry-pick易用版本，从某个分支拷贝某条记录合并到当前分支')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-k, --key [keyword]', '模糊搜索commit信息关键词', '')
// .option('-a, --author [author]', '提交者', '')
program.action((from: string, commitid: string[], opts: GitmBuildOption) => {
    const status = getStatus()
    const cur = getCurrent()
    if (!status) sh.exit(1)
    if (opts.key !== '' || opts.author !== '') {
        const cmd: Array<CommandType | string> = [`git checkout ${from}`, `git log --grep=${opts.key} --author=${opts.author}`]
        sh.echo(warning('为确保copy准确，请尽量完整填写关键词'))
        // if (!/^\d{4,}$/.test(opts.key)) {
        // 	sh.echo(error('为确保copy准确，关键词必须是4位以上的任务号或者bug修复编号'))
        // 	sh.exit(1)
        // }
        queue(cmd).then((data: QueueReturnsType[]) => {
            const commits: string[] = []
            if (data[1].code === 0) {
                const logs = data[1].out.match(/(commit\s[a-z0-9]*\n+)/g) || []
                let cmds: Array<CommandType | string> = [`git checkout ${cur}`]
                logs.forEach(el => {
                    commits.push(el.replace(/(commit\s)|\n/g, ''))
                })
                commits.reverse()
                if (commits.length > 0) {
                    cmds = cmds.concat([
                        {
                            cmd: `git cherry-pick ${commits.join(' ')}`,
                            config: { again: false, success: '记录合并成功', fail: '合并失败，请根据提示处理' }
                        },
                        {
                            cmd: 'git push',
                            config: { again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
                        }
                    ])
                } else {
                    sh.echo('没有找到任何记录')
                }
                queue(cmds)
            } else {
                sh.echo(data[1].err)
            }
        })
    } else {
        const cmd: Array<CommandType | string> = [
            {
                cmd: `git cherry-pick ${commitid.join(' ')}`,
                config: { again: false, success: '记录合并成功', fail: '合并失败，请根据提示处理' }
            },
            {
                cmd: 'git push',
                config: { again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
            }
        ]
        queue(cmd)
    }
})
program.parse(process.argv)
export {}
