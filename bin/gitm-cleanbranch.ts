#!/usr/bin/env ts-node
const { program } = require('commander')
const sh = require('shelljs')
const inquirer = require('inquirer')
const ora = require('ora')
const { options, args } = require('./conf/cleanbranch')
const {
    getIsGitProject,
    searchBranches,
    getCurrentBranch,
    getIsMergedTargetBranch,
    getIsBranchOrCommitExist
} = require('./core/git/index')
const { error, success, createArgs, delay } = require('./core/utils/index')
if (!getIsGitProject()) {
    sh.echo(error('当前目录不是git项目目录'))
    sh.exit(1)
}
const getConfig = require('./core/getConfig')
const config = getConfig()

import { GitmarsOptionOptionsType, GitmarsBranchType } from '../typings'

interface GitmBuildOption {
    list?: boolean
    type?: GitmarsBranchType
    target?: string
    key?: string
    exclude?: string
    include?: string
    remote?: boolean
    confirm?: boolean
}

/**
 * 判断是否合过
 *
 * @param branch - 分支名称
 * @param targets - 目标分支，数组或字符串
 * @param remote - 是否判断远程分支
 * @returns isMergedTarget - 是否合过
 */
function getIsMergedTarget(
    branch: string,
    targets: string | string[],
    remote?: boolean
) {
    branch = remote ? 'origin/' + branch : branch
    if (typeof targets === 'string') targets = [targets]
    for (const target of targets) {
        const isMerged = getIsMergedTargetBranch(branch, target, remote)
        if (!isMerged) return false
    }
    return true
}

/**
 * gitm cleanbranch
 */
program
    .name('gitm cleanbranch')
    .usage(
        '[branches...] [-l --list [list]] [-k --key [keyword]] [--exclude [exclude]] [--include [include]] [-t --type [type]] [--target [target]] [-r --remote]'
    )
    .description('清理合并过的功能分支')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-l, --list', '显示符合条件的分支列表', false)
// .option('-t, --type [type]', '分支的类型，共有3种：feature、bugfix、support，不传则默认全部', null)
// .option('--target [target]', '需要检测是否合过的目标分支名，不传默认是develop和release', null)
// .option('-k, --key [keyword]', '查询分支的关键词', null)
// .option('--exclude [exclude]', '排除关键词', '')
// .option('--include [include]', '包含关键词', '')
// .option('-r, --remote', '是否清理远程分支，默认清理本地分支', false)
// .option('-c, --confirm', '确认开始，为true时不显示确认框', false)
// .option('--deadline [deadline]', '删除固定时长之前的分支，填写格式：10s/2m/2h/3d/4M/5y', '15d') -----------------------
program.action(async (branches: string[], opt: GitmBuildOption) => {
    const spinner = ora()
    spinner.color = 'green'
    // 管理员以上级别才可执行，必须先配置好权限项
    const current = getCurrentBranch()
    const targets = opt.target
        ? opt.target.split(',')
        : [config.develop, config.release]
    sh.exec('git fetch', { silent: true })
    current !== config.develop &&
        sh.exec(`git checkout ${config.develop}`, { silent: true })
    // 没有传入指定分支，进行查询
    if (branches.length === 0) {
        branches = searchBranches({
            remote: opt.remote,
            type: opt.type,
            key: opt.key,
            exclude: opt.exclude,
            include: opt.include
        })
    }
    const _willDeleteBranch: string[] = []
    if (branches.length > 0) {
        if (!opt.list && !opt.confirm) {
            await inquirer
                .prompt({
                    type: 'confirm',
                    name: 'value',
                    message: '即将开始批量删除分支，是否继续？',
                    default: false
                })
                .then((answers: any) => {
                    if (!answers.value) {
                        sh.echo(success('已退出'))
                        sh.exit(0)
                    }
                })
        }
    } else {
        sh.echo(success('没有查询到任何分支'))
        sh.exit(0)
    }
    for (const branch of branches) {
        // 跳过主干分支
        if (
            [
                config.master,
                config.develop,
                config.release,
                config.bugfix,
                config.support
            ].includes(branch)
        ) {
            continue
        }
        spinner.start(success(`开始分析：${branch}`))
        const isMerged = getIsMergedTarget(branch, targets, opt.remote)
        if (!isMerged) {
            spinner.fail(error(`不可删除：${branch}`))
            continue
        }

        _willDeleteBranch.push(branch)
        await delay(200)
        spinner.succeed(success(`分析完成：${branch}`))
        if (opt.list) {
            continue
        }

        // 开始分支删除流程
        const removeLocal = getIsBranchOrCommitExist(branch)
        const removeRemote =
            opt.remote && getIsBranchOrCommitExist(branch, true)
        if (removeLocal || removeRemote) {
            spinner.start(success(`正在删除：${branch}`))
            await delay(200)
            spinner.succeed(success(`删除成功：${branch}`))
        }
        // 仅清理合过dev和release的分支
        if (removeLocal) {
            sh.exec(`git branch -D ${branch}`, { silent: true })
        }
        // 清理远程分支
        if (removeRemote) {
            sh.exec(`git push origin --delete ${branch}`, {
                silent: true
            })
        }
    }
    spinner.stop()
    // 打印列表
    if (opt.list) {
        if (_willDeleteBranch.length > 0) {
            sh.echo(
                success(
                    `分析完成，以下分支合并过${targets.join(
                        ','
                    )}分支，可以清理：`
                )
            )
            console.info('\n' + success(_willDeleteBranch.join(' ') + '\n'))
        } else {
            sh.echo(success('分析完成，没有分支需要清理'))
        }
    } else {
        sh.echo(success('删除完成'))
    }
})
program.parse(process.argv)
export {}
