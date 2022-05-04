#!/usr/bin/env ts-node
import type { CommandType } from '../typings'
const { program } = require('commander')
const sh = require('shelljs')
const { red } = require('colors')
const { queue } = require('@gitmars/core/lib/queue')
const getIsGitProject = require('@gitmars/core/lib/git/getIsGitProject')
if (!getIsGitProject()) {
    sh.echo(red('当前目录不是git项目目录'))
    process.exit(1)
}
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
