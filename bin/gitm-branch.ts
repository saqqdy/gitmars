#!/usr/bin/env ts-node
const { program } = require('commander')
const sh = require('shelljs')
const { options, args } = require('./conf/branch')
const { queue } = require('./core/utils/index')
const {
    getIsGitProject,
    getIsBranchOrCommitExist
} = require('./core/git/index')
const { error, createArgs } = require('./core/utils/index')
if (!getIsGitProject()) {
    sh.echo(error('当前目录不是git项目目录'))
    sh.exit(1)
}

import {
    GitmarsBranchType,
    QueueReturnsType,
    GitmarsOptionOptionsType,
    CommandType
} from '../typings'

interface GitmBuildOption {
    key?: string
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
        '[-k --key [keyword]] [-t --type [type]] [-d --delete [branch]] [-r --remote [remote]] [-D --forcedelete [branch]] [-u --upstream [upstream]]'
    )
    .description(
        '分支查询、删除（注意该指令不用于创建分支，如需创建分支请走start流程）'
    )
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-k, --key [keyword]', '查询分支的关键词', null)
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
        cmd.push('git branch -a')
        queue(cmd).then((data: QueueReturnsType[]) => {
            data.forEach((el: QueueReturnsType, index: number): void => {
                if (index === 0 && el.code === 0) {
                    let list =
                        (el.out &&
                            typeof el.out === 'string' &&
                            el.out.split('\n')) ||
                        []
                    list = list.filter(el => {
                        let fit = true
                        if (opt.key) {
                            fit = fit && el.indexOf(opt.key) > -1
                        }
                        if (opt.type) {
                            fit = fit && el.indexOf(opt.type) > -1
                        }
                        if (opt.remote) {
                            fit = fit && el.indexOf('remotes/origin') > -1
                        } else {
                            fit = fit && el.indexOf('remotes/origin') === -1
                        }
                        return fit
                    })
                    sh.echo(list.join('\n'))
                }
            })
        })
        return
    }
    queue(cmd)
})
program.parse(process.argv)
export {}
