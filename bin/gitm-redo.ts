#!/usr/bin/env ts-node
const { program } = require('commander')
const inquirer = require('inquirer')
const sh = require('shelljs')
const { options, args } = require('./conf/redo')
const { queue } = require('./core/queue')
const { getIsGitProject } = require('./core/git/index')
const { error, warning } = require('./core/utils/index')
const { createArgs } = require('./core/utils/index')
const { spawnSync } = require('./core/spawn')
if (!getIsGitProject()) {
    sh.echo(error('当前目录不是git项目目录'))
    sh.exit(1)
}

import {
    GitLogType,
    GitmarsOptionOptionsType,
    CommandType,
    InitInquirerPromptType
} from '../typings'

interface GitmBuildOption {
    branch?: string
    mode?: 1 | 2
}

/**
 * gitm redo
 */
program
    .name('gitm redo')
    .usage('[commitid...] [-b --branch [branch]] [-m --mode [mode]]')
    .description('撤销一次提交记录')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .arguments('[commitid...]')
// .option('-b, --branch [branch]', '需要撤销的分支名', '')
// .option('-m, --mode [mode]', '针对撤销一次merge记录，需要传入类型：1 = 保留当前分支代码，2 = 保留传入代码', 1)
program.action(async (commitid: string[], opt: GitmBuildOption) => {
    const cmd: Array<CommandType | string> = []
    let m = ''
    if (opt.mode) m = ' -m ' + Math.abs(Number(opt.mode))
    if (opt.branch) {
        const keys = ['%H', '%aI', '%an']
        const logList: GitLogType[] = []
        let logs = logList.map(log => log['%H']),
            { stdout } = spawnSync('git', [
                'log',
                '--merges',
                `--grep="'${opt.branch}'"`,
                '--date-order',
                '--pretty',
                `format:${keys.join(',=')}-end-`
            ])
        stdout = stdout.replace(/[\r\n]+/g, '').replace(/-end-$/, '')
        // 读取记录
        stdout &&
            stdout.split('-end-').forEach((log: string) => {
                const args = log.split(',=')
                const map: {
                    [props: string]: string
                } = {}
                keys.forEach((key, i) => {
                    map[key] = args[i]
                })
                logList.push(map)
            })
        logList.reverse()
        // 多条记录，提示选择要恢复的记录
        if (logList.length > 1) {
            const prompt: InitInquirerPromptType = {
                type: 'checkbox',
                message: '检测到存在多条记录，请选择要撤销的项',
                name: 'commitIDs',
                choices: []
            }
            logList.forEach(log => {
                prompt.choices.push({
                    name: `${log['%an']}操作于：${log['%aI']}`,
                    value: log['%H'],
                    checked: true
                })
            })
            const { commitIDs } = await inquirer.prompt(prompt)
            logs = commitIDs
        }
        logs.forEach(log => {
            cmd.push({
                cmd: `git revert ${log}${m}`,
                config: {
                    again: true,
                    success: '撤销成功',
                    fail: '出错了，请根据提示处理'
                }
            })
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
        sh.echo(warning('指令不合法'))
        sh.exit(1)
    }
    queue(cmd)
})
program.parse(process.argv)
export {}
