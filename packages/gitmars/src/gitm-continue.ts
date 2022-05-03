#!/usr/bin/env ts-node
import type { CommandType, GitmarsOptionOptionsType } from '../typings'
const { program } = require('commander')
const sh = require('shelljs')
const { green, yellow, red } = require('colors')
const inquirer = require('inquirer')
const { queue } = require('@gitmars/core/queue')
const {
    getCommandCache,
    cleanCommandCache
} = require('@gitmars/core/cache/commandCache')
const getIsGitProject = require('@gitmars/core/git/getIsGitProject')
const getGitStatus = require('@gitmars/core/git/getGitStatus')
const { createArgs } = require('@gitmars/core/utils/command')
const { options, args } = require('./conf/continue')
if (!getIsGitProject()) {
    sh.echo(red('当前目录不是git项目目录'))
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
    .description('继续未完成的操作')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-l, --list', '显示指令队列', false)
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
                    message:
                        '检测到有未提交的文件，在合并分支的过程遇到冲突，需要在处理冲突后执行一下 git add . 和 git commit ,然后再执行 gitm continue。是否要强制继续执行脚本？',
                    default: false
                })
                .then((answers: any) => {
                    if (!answers.value) {
                        sh.echo(green('已退出'))
                        process.exit(0)
                    }
                })
        } else if (sum['??'].length > 0) {
            sh.echo(yellow('检测到有未加入版本的文件，请留意！'))
        }
        queue(cmd).then(() => {
            cleanCommandCache()
        })
    } else {
        sh.echo(red('队列里面没有未执行的指令'))
    }
})
program.parse(process.argv)
export {}
