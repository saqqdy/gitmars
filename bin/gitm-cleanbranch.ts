#!/usr/bin/env ts-node
const { program } = require('commander')
const sh = require('shelljs')
const inquirer = require('inquirer')
const { options, args } = require('./conf/cleanbranch')
const {
    error,
    success,
    isGitProject,
    getCurrent,
    searchBranches,
    delay
} = require('./js/index')
const getIsMergedTargetBranch = require('./js/branch/getIsMergedTargetBranch')
const getIsBranchOrCommitExist = require('./js/branch/getIsBranchOrCommitExist')
const ora = require('ora')
const { createArgs } = require('./js/tools')
if (!isGitProject()) {
    sh.echo(error('当前目录不是git项目目录'))
    sh.exit(1)
}
const getConfig = require('./js/getConfig')
const config = getConfig()

import {
    GitmarsOptionOptionsType,
    GitmarsBranchType
} from '../typings'

interface GitmBuildOption {
    list?: boolean
    type?: GitmarsBranchType
    except?: string
    remote?: boolean
    local?: boolean
}

/**
 * gitm cleanbranch
 */
program
    .name('gitm cleanbranch')
    .usage(
        '[-l --list [list]] [--except [exception]] [-t --type [type]] [-r --remote]'
    )
    .description('清理合并过的功能分支')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-l, --list', '显示符合条件的分支列表', false)
// .option('-t, --type [type]', '分支的类型，共有3种：feature、bugfix、support，不传则默认全部', null)
// .option('--except [except]', '排除关键词', '')
// .option('-r, --remote', '是否清理远程分支，默认清理本地分支', false)
// .option('--deadline [deadline]', '删除固定时长之前的分支，填写格式：10s/2m/2h/3d/4M/5y', '15d') -----------------------
program.action(async (opt: GitmBuildOption) => {
    const spinner = ora()
    spinner.color = 'green'
    // 管理员以上级别才可执行，必须先配置好权限项
    const current = getCurrent()
    sh.exec(`git fetch`, { silent: true })
    current !== config.develop &&
        sh.exec(`git checkout ${config.develop}`, { silent: true })
    const branches = searchBranches({
        remote: opt.remote,
        type: opt.type,
        except: opt.except
    })
    let _willDeleteBranch: string[] = []
    if (branches.length > 0) {
        if (!opt.list) {
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
        const branchName = branch.replace(/^origin\//, '')
        // 跳过主干分支和非二级名称的分支
        if (
            [
                config.master,
                config.develop,
                config.release,
                config.bugfix,
                config.support
            ].includes(branchName) ||
            branchName.indexOf('/') === -1
        ) {
            continue
        }
        spinner.start(success(`开始分析：${branchName}`))
        const isMergedDev = getIsMergedTargetBranch(
            branch,
            config.dev,
            opt.remote
        )
        if (!isMergedDev) {
            spinner.fail()
            continue
        }
        const isMergedRelease = getIsMergedTargetBranch(
            branch,
            config.release,
            opt.remote
        )
        if (!isMergedRelease) {
            spinner.fail()
            continue
        }
        _willDeleteBranch.push(branchName)
        await delay(200)
        spinner.succeed()
        if (opt.list) {
            continue
        }

        // 开始分支删除流程
        const removeLocal = getIsBranchOrCommitExist(branchName)
        const removeRemote =
            opt.remote && getIsBranchOrCommitExist(branchName, true)
        if (removeLocal || removeRemote) {
            spinner.start(success(`正在删除：${branchName}`))
            await delay(200)
            spinner.succeed()
        }
        // 仅清理合过dev和release的分支
        if (removeLocal) {
            sh.exec(`git branch -D ${branchName}`, { silent: true })
        }
        // 清理远程分支
        if (removeRemote) {
            sh.exec(`git push origin --delete ${branchName}`, {
                silent: true
            })
        }
    }
    spinner.stop()
    // 打印列表
    if (opt.list) {
        sh.echo(success('分析完成，找到了以下分支：'))
        console.info(_willDeleteBranch)
    } else {
        sh.echo(success('删除完成'))
    }
})
program.parse(process.argv)
export {}
