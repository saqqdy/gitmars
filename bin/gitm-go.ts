#!/usr/bin/env ts-node
const { program } = require('commander')
const sh = require('shelljs')
const inquirer = require('inquirer')
const { options, args } = require('./conf/go')
const getProperty = require('js-cool/lib/getProperty')
const commands = require('./core/go/index')
const { getCurrentBranch } = require('./core/git/index')
const { error, success, createArgs } = require('./core/utils/index')

import { GitmarsOptionOptionsType } from '../typings'

/**
 * gitm go
 */
program.name('gitm go').usage('[command]').description('智能猜测你要执行的动作')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
program.action(async (command: string): Promise<void> => {
    const current = getCurrentBranch()
    sh.echo(success(`当前分支${current}，系统猜测你可能想做以下操作：`))
    if (command) {
        // 执行对应指令
        const cmd = getProperty(commands, command)
        if (!cmd) {
            sh.echo(error('您输入的指令没有找到，可能暂不支持'))
            sh.exit(1)
        }
        cmd()
    } else {
        // 选择指令
        inquirer
            .prompt({
                type: 'list',
                name: 'command',
                message: '请选择你想要的操作?',
                default: 'combine',
                choices: [
                    new inquirer.Separator(' === 1. Gitmars工作流 === '),
                    'combine',
                    'end',
                    'update',
                    'build',
                    'start',
                    'admin.publish',
                    'admin.update',
                    'admin.create',
                    'admin.clean',
                    new inquirer.Separator(' === 2. 高级工具 === '),
                    'branch',
                    'copy',
                    'get',
                    'save',
                    'cleanbranch',
                    'clean',
                    'revert',
                    'link',
                    'unlink',
                    'postmsg',
                    new inquirer.Separator(' === 退出 === '),
                    'exit',
                    new inquirer.Separator()
                ],
                filter: (val: string): string => {
                    return val
                }
            })
            .then((answers: any) => {
                if (answers.command === 'exit') {
                    sh.echo(success('已退出'))
                    sh.exit(0)
                }
                sh.echo(success(`你选择了${answers.command}指令`))
                // 执行对应指令
                getProperty(commands, answers.command)()
            })
    }
})
program.parse(process.argv)
export {}
