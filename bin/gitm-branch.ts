#!/usr/bin/env ts-node
const { program } = require('commander')
const sh = require('shelljs')
const { green, red } = require('colors')
const { options, args } = require('./conf/branch')
const { queue } = require('./core/queue')
const {
    searchBranches,
    getIsGitProject,
    getIsBranchOrCommitExist
} = require('./core/git/index')
const { createArgs } = require('./core/utils/index')
if (!getIsGitProject()) {
    sh.echo(red('当前目录不是git项目目录'))
    process.exit(1)
}

import {
    GitmarsBranchType,
    GitmarsOptionOptionsType,
    CommandType
} from '../typings'

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
    } else if (opt.forcedelete) {
        // 强行删除分支
        if (isBranchExist) cmd.push(`git branch -D ${opt.forcedelete}`)
        if (opt.remote) cmd.push(`git push origin --delete ${opt.delete}`)
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
