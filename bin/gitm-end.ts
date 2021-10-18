#!/usr/bin/env ts-node
const { program } = require('commander')
const sh = require('shelljs')
const { options, args } = require('./conf/end')
const { error, queue, getStatus, getCurrent, searchBranch, isGitProject } = require('./js/index')
const { createArgs } = require('./js/tools')
if (!isGitProject()) {
    sh.echo(error('当前目录不是git项目目录'))
    sh.exit(1)
}
const getConfig = require('./js/getConfig')
const getGitConfig = require('./js/getGitConfig')
const getUserToken = require('./js/api')
const { defaults } = require('./js/global')
const config = getConfig()
const { appName } = getGitConfig()

import { FetchDataType, GitmarsOptionOptionsType, CommandType } from '../typings'

interface GitmBuildOption {
    combine: boolean
    asFeature: boolean
}

/**
 * gitm end
 */
program.name('gitm end').usage('[type] [name]').description('合并bugfix任务分支、合并feature功能开发分支，合并完成后将删除对应分支')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('--no-combine', '不合并主干分支（请确保分支已经上线）')
// .option('--as-feature', 'bug分支合并到release')
program.action(async (type: string, name: string, opt: GitmBuildOption): Promise<void> => {
    const allow = ['bugfix', 'feature', 'support'] // 允许执行的指令
    const deny = [defaults.master, defaults.develop, defaults.release, defaults.bugfix, defaults.support]
    const { token, level, nickname = '' } = config.api ? getUserToken() : ({} as FetchDataType)
    const status = getStatus()
    if (!status) sh.exit(1)
    if (!type) {
        // type和name都没传且当前分支是开发分支
        ;[type, name] = getCurrent().split('/')
        if (!name) {
            deny.includes(type) && sh.echo(error(`骚年，你在${type}分支执行这个指令是什么骚操作？`))
            sh.exit(1)
        }
    } else if (!name) {
        // 传了type没传name
        if (allow.includes(type)) {
            sh.echo('请输入分支名称')
            sh.exit(1)
        }
        const branchs = await searchBranch(type)
        if (branchs.length === 1) {
            ;[type, name] = branchs[0].split('/')
        } else {
            sh.echo(branchs.length > 1 ? `查询到多条名称包含${type}的分支，请输入分支类型` : error('分支不存在，请正确输入'))
            sh.exit(1)
        }
    }
    if (allow.includes(type) && name) {
        const base: string = opt.asFeature ? config.release : type === 'bugfix' ? config.bugfix : config.release
        let cmd: Array<CommandType | string> = []
        if (opt.combine) {
            // 需要合并代码到dev
            cmd = [
                'git fetch',
                `git checkout ${config.develop}`,
                'git pull',
                {
                    cmd: `git merge --no-ff ${type}/${name}`,
                    config: { again: false, success: `${type}/${name}合并到${config.develop}成功`, fail: `${type}/${name}合并到${config.develop}出错了，请根据提示处理` }
                },
                {
                    cmd: 'git push',
                    config: { again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
                },
                `git checkout ${type}/${name}`
            ]
        }
        // support分支需要合到bugfix
        if (type === 'support') {
            cmd = cmd.concat(
                !level || level < 3
                    ? [
                          'git fetch',
                          `git checkout ${config.bugfix}`,
                          'git pull',
                          {
                              cmd: `git merge --no-ff ${type}/${name}`,
                              config: { again: false, success: `${type}/${name}合并到${config.bugfix}成功`, fail: `${type}/${name}合并到${config.bugfix}出错了，请根据提示处理` }
                          },
                          {
                              cmd: 'git push',
                              config: { again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
                          },
                          `git checkout ${type}/${name}`
                      ]
                    : [
                          {
                              cmd: `git push --set-upstream origin ${type}/${name}`,
                              config: { again: true, success: '推送远程并关联远程分支成功', fail: '推送远程失败，请根据提示处理' }
                          },
                          {
                              cmd: `curl -i -H "Content-Type: application/json" -X POST -d "{\\"source_branch\\":\\"${type}/${name}\\",\\"target_branch\\":\\"${config.bugfix}\\",\\"private_token\\":\\"${token}\\",\\"title\\":\\"Merge branch '${type}/${name}' into '${config.bugfix}'\\"}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`,
                              config: { again: true, success: '成功创建合并请求', fail: '创建合并请求出错了，请根据提示处理' }
                          },
                          `gitm postmsg "${nickname}在${appName}项目提交了${type}/${name}分支合并到${config.bugfix}分支的merge请求"`
                      ]
            )
        }
        if (!opt.combine) {
            // 不合并代码
            cmd = cmd.concat([
                `git checkout ${config.develop}`,
                `git branch -D ${type}/${name}`,
                {
                    cmd: `git push origin --delete ${type}/${name}`,
                    config: { again: true, success: '成功删除远程分支', fail: '删除失败，请联系管理员' }
                }
            ])
        } else {
            // 需要合并代码
            cmd = cmd.concat(
                !level || level < 3
                    ? [
                          'git fetch',
                          `git checkout ${base}`,
                          'git pull',
                          {
                              cmd: `git merge --no-ff ${type}/${name}`,
                              config: { again: false, success: `${type}/${name}合并到${base}成功`, fail: `${type}/${name}合并到${base}出错了，请根据提示处理` }
                          },
                          {
                              cmd: 'git push',
                              config: { again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
                          },
                          `git branch -D ${type}/${name}`,
                          {
                              cmd: `git push origin --delete ${type}/${name}`,
                              config: { again: true, success: '成功删除远程分支', fail: '删除失败，请联系管理员' }
                          },
                          `git checkout ${config.develop}`
                      ]
                    : [
                          {
                              cmd: `git push --set-upstream origin ${type}/${name}`,
                              config: { again: true, success: '推送远程并关联远程分支成功', fail: '推送远程失败，请根据提示处理' }
                          },
                          {
                              cmd: `curl -i -H "Content-Type: application/json" -X POST -d "{\\"source_branch\\":\\"${type}/${name}\\",\\"target_branch\\":\\"${base}\\",\\"private_token\\":\\"${token}\\",\\"title\\":\\"Merge branch '${type}/${name}' into '${base}'\\"}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`,
                              config: { again: true, success: '成功创建合并请求', fail: '创建合并请求出错了，请根据提示处理' }
                          },
                          `gitm postmsg "${nickname}在${appName}项目提交了${type}/${name}分支合并到${base}分支的merge请求"`
                      ]
            )
        }
        queue(cmd)
    } else {
        sh.echo(error('type只允许输入：' + JSON.stringify(allow)))
        sh.exit(1)
    }
})
program.parse(process.argv)
export {}
