#!/usr/bin/env ts-node
const { program } = require('commander')
const sh = require('shelljs')
const inquirer = require('inquirer')
const { options, args } = require('./conf/cleanbranch')
const { error, success, isGitProject, searchBranchs } = require('./js/index')
const getIsMergedTargetBranch = require('./js/branch/getIsMergedTargetBranch')
const getIsBranchOrCommitExist = require('./js/branch/getIsBranchOrCommitExist')
const { createArgs } = require('./js/tools')
if (!isGitProject()) {
    sh.echo(error('当前目录不是git项目目录'))
    sh.exit(1)
}
// const getUserToken = require('./js/api')
// const getGitConfig = require('./js/getGitConfig')
const getConfig = require('./js/getConfig')
// const { appName } = getGitConfig()
const config = getConfig()

import {
    GitmarsOptionOptionsType,
    CommandType,
    GitmarsBranchType
} from '../typings'

interface GitmBuildOption {
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
    .usage('[-f --force]')
    .description('暂存当前分支文件')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-t, --type [type]', '分支的类型，共有3种：feature、bugfix、support，不传则默认全部', null)
// .option('--except [except]', '排除关键词', '')
// .option('-r, --remote', '是否清理远程分支，默认清理本地分支', false)
// .option('--deadline [deadline]', '删除固定时长之前的分支，填写格式：10s/2m/2h/3d/4M/5y', '15d') -----------------------
program.action(async (opt: GitmBuildOption) => {
    sh.exec(`git fetch`, { silent: true })
    sh.exec(`git checkout ${config.develop}`, { silent: true })
    const branchs = searchBranchs({
        remote: opt.remote,
        local: !opt.remote,
        type: opt.type,
        except: opt.except
    })
    if (branchs.length > 0) {
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
    for (const branch of branchs) {
        const branchName = branch.replace(/^origin\//, '')
        let cmd: Array<CommandType | string> = []
        // const [type, ..._nameArr] = branchName.split('/')
        // const name = _nameArr.join('/')
        const isMergedDev = getIsMergedTargetBranch(
            branch,
            config.dev,
            opt.remote
        )
        if (!isMergedDev) continue
        const isMergedRelease = getIsMergedTargetBranch(
            branch,
            config.release,
            opt.remote
        )
        if (!isMergedRelease) continue
        // const isMergedBug = getIsMergedTargetBranch(
        //     branch,
        //     config.bugfix,
        //     opt.remote
        // )
        // if (!isMergedBug) continue
        // 仅清理合过dev和release的分支
        sh.exec(`git branch -D ${branchName}`, { silent: true })
        if (opt.remote && getIsBranchOrCommitExist(branchName, true)) {
            sh.exec(`git push origin --delete ${branchName}`, {
                silent: true
            })
        }
    }
})
program.parse(process.argv)
export {}
