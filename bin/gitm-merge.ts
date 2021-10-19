#!/usr/bin/env ts-node
const { program } = require('commander')
const sh = require('shelljs')
const { error, queue, isGitProject } = require('./js/index')
if (!isGitProject()) {
    sh.echo(error('当前目录不是git项目目录'))
    sh.exit(1)
}

import { CommandType } from '../typings'

/**
 * gitm merge
 */
program
    .name('gitm merge')
    .usage('<name>')
    .arguments('<name>')
    .description('合并分支代码')
    .action((name: string) => {
        const cmd: Array<CommandType | string> = [
            {
                cmd: `git merge --no-ff ${name}`,
                config: {
                    again: false,
                    success: `合并${name}分支成功`,
                    fail: `合并${name}分支出错了，请根据提示处理`
                }
            },
            {
                cmd: 'git push',
                config: {
                    again: true,
                    success: '推送成功',
                    fail: '推送失败，请根据提示处理'
                }
            }
        ]
        queue(cmd)
    })
program.parse(process.argv)
export {}
