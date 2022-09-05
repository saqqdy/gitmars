#!/usr/bin/env ts-node
import type { CommandType } from '../typings'
const { program } = require('commander')
const sh = require('shelljs')
const { red } = require('chalk')
const { queue } = require('@gitmars/core/lib/queue')
const getIsGitProject = require('@gitmars/core/lib/git/getIsGitProject')
const i18n = require('./locales')
if (!getIsGitProject()) {
    sh.echo(
        red(i18n.__('The current directory is not a git project directory'))
    )
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
                    success: i18n.__('Successful Pushed'),
                    fail: i18n.__('Push failed, please follow the prompts')
                }
            }
        ]
        queue(cmd)
    })
program.parse(process.argv)
export {}
