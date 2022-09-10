#!/usr/bin/env ts-node
import { program } from 'commander'
import sh from 'shelljs'
import chalk from 'chalk'
import inquirer from 'inquirer'
import getProperty from 'js-cool/es/getProperty'
import getCurrentBranch from '@gitmars/core/lib/git/getCurrentBranch'
import { createArgs } from '@gitmars/core/lib/utils/command'
import type { GitmarsOptionOptionsType } from '../typings'
import * as commands from '#lib/go/index'
import goConfig from '#lib/conf/go'
import i18n from '#lib/locales/index'

const { green, red } = chalk
const { args, options } = goConfig

/**
 * gitm go
 */
program
    .name('gitm go')
    .usage('[command]')
    .description(
        i18n.__('Intelligent guessing of the action you want to perform')
    )
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
program.action(async (command: string): Promise<void> => {
    const current = getCurrentBranch()
    sh.echo(green(`当前分支${current}，系统猜测你可能想做以下操作：`))
    if (command) {
        // 执行对应指令
        const cmd = getProperty(commands, command)
        if (!cmd) {
            sh.echo(
                red(
                    i18n.__(
                        'The command you entered was not found and may not be supported at this time'
                    )
                )
            )
            process.exit(1)
        }
        cmd()
    } else {
        // 选择指令
        inquirer
            .prompt({
                type: 'list',
                name: 'command',
                message: i18n.__('Please select the operation you want?'),
                default: 'combine',
                choices: [
                    new inquirer.Separator(
                        ' === 1. ' + i18n.__('Gitmars Workflow') + ' === '
                    ),
                    'combine',
                    'end',
                    'update',
                    'build',
                    'start',
                    'undo',
                    'redo',
                    'admin.publish',
                    'admin.update',
                    'admin.create',
                    'admin.clean',
                    new inquirer.Separator(
                        ' === 2. ' + i18n.__('Advanced Tools') + ' === '
                    ),
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
                    new inquirer.Separator(' === ' + i18n.__('Exit') + ' === '),
                    'exit',
                    new inquirer.Separator()
                ],
                filter: (val: string): string => {
                    return val
                }
            })
            .then((answers: any) => {
                if (answers.command === 'exit') {
                    sh.echo(green('已退出'))
                    process.exit(0)
                }
                sh.echo(green(`你选择了${answers.command}指令`))
                // 执行对应指令
                getProperty(commands, answers.command)()
            })
    }
})
program.parse(process.argv)
export {}
