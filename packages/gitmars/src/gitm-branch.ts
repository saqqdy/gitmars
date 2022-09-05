#!/usr/bin/env ts-node
import type {
    CommandType,
    GitmarsBranchType,
    GitmarsOptionOptionsType
} from '../typings'
const { program } = require('commander')
const sh = require('shelljs')
const { green, red } = require('chalk')
const { queue } = require('@gitmars/core/lib/queue')
const searchBranches = require('@gitmars/core/lib/git/searchBranches')
const getIsGitProject = require('@gitmars/core/lib/git/getIsGitProject')
const getIsBranchOrCommitExist = require('@gitmars/core/lib/git/getIsBranchOrCommitExist')
const { createArgs } = require('@gitmars/core/lib/utils/command')
const { options, args } = require('./conf/branch')
const i18n = require('./locales')
if (!getIsGitProject()) {
    sh.echo(
        red(i18n.__('The current directory is not a git project directory'))
    )
    process.exit(1)
}
interface GitmBuildOption {
    key?: string
    exclude?: string
    include?: string
    remote?: boolean
    type?: GitmarsBranchType
    delete?: string | null
    forcedelete?: string | null
    upstream?: string
}

/**
 * gitm branch
 */
program
    .name('gitm branch')
    .usage(
        '[-k --key [keyword]] [-t --type [type]] [-d --delete [branch]] [--exclude [exclude]] [--include [include]] [-r --remote [remote]] [-D --forcedelete [branch]] [-u --upstream [upstream]]'
    )
    .description(
        '分支查询、删除（注意该指令不用于创建分支，如需创建分支请走start流程）'
    )
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-k, --key [keyword]', '查询分支的关键词', null)
// .option('--exclude [exclude]', '排除关键词', '')
// .option('--include [include]', '包含关键词', '')
// .option('-r, --remote', '是否查询远程分支（deletes模式下改用于删除远程分支）默认只查询本地', false)
// .option('-t, --type [type]', '查询分支的类型，共有3种：feature、bugfix、support，不传则查询全部', null)
// .option('-d, --delete [branch]', '删除分支', null)
// .option('-D, --forcedelete [branch]', '强行删除分支', null)
// .option('-u, --upstream [upstream]', '设置与远程分支关联')
program.action((opt: GitmBuildOption): void => {
    const cmd: Array<CommandType | string> = []
    const isBranchExist = getIsBranchOrCommitExist(opt.delete)
    if (opt.delete) {
        // 删除分支
        if (isBranchExist) cmd.push(`git branch -d ${opt.delete}`)
        if (opt.remote) cmd.push(`git push origin --delete ${opt.delete}`)
        cmd.push({
            cmd: 'git remote prune origin',
            config: {
                again: true,
                success: i18n.__('Cleanup of remote branch was successful'),
                fail: i18n.__(
                    'Failed to clean up remote branch, please follow the prompts'
                )
            }
        })
    } else if (opt.forcedelete) {
        // 强行删除分支
        if (isBranchExist) cmd.push(`git branch -D ${opt.forcedelete}`)
        if (opt.remote) cmd.push(`git push origin --delete ${opt.delete}`)
        cmd.push({
            cmd: 'git remote prune origin',
            config: {
                again: true,
                success: i18n.__('Cleanup of remote branch was successful'),
                fail: i18n.__(
                    'Failed to clean up remote branch, please follow the prompts'
                )
            }
        })
    } else if (opt.upstream) {
        if (typeof opt.upstream === 'string') {
            // 与远程分支关联
            cmd.push(`git branch --set-upstream-to origin/${opt.upstream}`)
        } else {
            // 取消远程分支关联
            cmd.push('git branch --unset-upstream')
        }
    } else {
        // 分支查询
        const branches = searchBranches({
            remote: opt.remote,
            type: opt.type,
            key: opt.key,
            exclude: opt.exclude,
            include: opt.include
        })
        sh.echo(green(branches.join('\n')))
        return
    }
    queue(cmd)
})
program.parse(process.argv)
export {}
