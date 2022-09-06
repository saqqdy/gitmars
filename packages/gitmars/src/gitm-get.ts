#!/usr/bin/env ts-node
import type { GitmarsOptionOptionsType } from '../typings'
const { program } = require('commander')
const sh = require('shelljs')
const { yellow, red } = require('chalk')
const { queue } = require('@gitmars/core/lib/queue')
const getIsGitProject = require('@gitmars/core/lib/git/getIsGitProject')
const getCurrentBranch = require('@gitmars/core/lib/git/getCurrentBranch')
const getStashList = require('@gitmars/core/lib/git/getStashList')
const { createArgs } = require('@gitmars/core/lib/utils/command')
const { options, args } = require('./conf/get')
const i18n = require('./locales')
if (!getIsGitProject()) {
    sh.echo(
        red(i18n.__('The current directory is not a git project directory'))
    )
    process.exit(1)
}
interface GitmBuildOption {
    keep?: boolean
}

/**
 * gitm get
 */
program
    .name('gitm get')
    .usage('[message] [index] [-k --keep [keep]]')
    .description(i18n.__('Restore staging area file'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-k, --keep [keep]', i18n.__('Keep staging area not deleted'), false)
program.action((message: string, index: string, opt: GitmBuildOption) => {
    if (!message) message = getCurrentBranch()
    const list = getStashList(message)
    if (list.length === 0) {
        sh.echo(yellow(i18n.__('There are no files staged in this branch!')))
        process.exit(0)
    }
    if (index === undefined && list.length > 1) {
        sh.echo(
            yellow(`该分支下有${list.length}条暂存记录，默认恢复最近的一条记录`)
        )
    }
    if (list.length > 2) {
        sh.echo(
            yellow(
                `该分支下有${list.length}条暂存记录，建议定期清理不必要的暂存记录！`
            )
        )
    }
    queue([
        {
            cmd: `git stash ${opt.keep ? 'apply' : 'pop'} ${
                list[index || 0].key
            }`,
            config: {
                again: opt.keep
                    ? false
                    : `git stash drop ${list[index || 0].key}`,
                success: i18n.__('File recovery successful'),
                fail: i18n.__('Recovery failed, please check for conflicts')
            }
        },
        'git reset -q HEAD -- .'
    ])
})
program.parse(process.argv)
export {}
