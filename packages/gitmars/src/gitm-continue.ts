#!/usr/bin/env ts-node
import { program } from 'commander'
import sh from 'shelljs'
import chalk from 'chalk'
import inquirer from 'inquirer'
import { queue } from '@gitmars/core/lib/queue'
import getIsGitProject from '@gitmars/core/lib/git/getIsGitProject'
import getGitStatus from '@gitmars/core/lib/git/getGitStatus'
import { createArgs } from '@gitmars/core/lib/utils/command'
import {
    cleanCommandCache,
    getCommandCache
} from '@gitmars/core/lib/cache/commandCache'
import type { CommandType, GitmarsOptionOptionsType } from '../typings'
import continueConfig from '#lib/conf/continue'
import lang from '#lib/common/local'

const { t } = lang
const { green, red, yellow } = chalk
const { args, options } = continueConfig

if (!getIsGitProject()) {
    sh.echo(red(t('The current directory is not a git project directory')))
    process.exit(1)
}

interface GitmBuildOption {
    list?: boolean
}

/**
 * gitm continue
 */
program
    .name('gitm continue')
    .usage('[-l --list]')
    .description(t('Continue unfinished operations'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-l, --list', t('Show command queue'), false)
program.action(async (opt: GitmBuildOption) => {
    const sum = getGitStatus()
    const cmd: Array<CommandType | string> = getCommandCache()
    if (opt.list) {
        sh.echo(cmd)
        process.exit(0)
    }
    if (cmd.length > 0) {
        // 检测是否有未提交的文件
        if (
            sum.A.length > 0 ||
            sum.D.length > 0 ||
            sum.M.length > 0 ||
            sum.UU.length > 0
        ) {
            await inquirer
                .prompt({
                    type: 'confirm',
                    name: 'value',
                    message: t(
                        'A conflict has been detected in the merge branch and you need to run git add . Do you want to force the script to continue?'
                    ),
                    default: false
                })
                .then((answers: any) => {
                    if (!answers.value) {
                        sh.echo(green(t('exited')))
                        process.exit(0)
                    }
                })
        } else if (sum['??'].length > 0) {
            sh.echo(
                yellow(t('An uncommitted file was detected, please be aware!'))
            )
        }
        queue(cmd).then(() => {
            cleanCommandCache()
        })
    } else {
        sh.echo(red(t('There are no unexecuted commands in the queue')))
    }
})
program.parse(process.argv)
export {}
