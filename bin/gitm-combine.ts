#!/usr/bin/env ts-node
const { program } = require('commander')
const sh = require('shelljs')
const { options, args } = require('./conf/combine')
const {
    error,
    warning,
    queue,
    getStatus,
    getCurrent,
    searchBranch,
    isGitProject
} = require('./js/index')
const getIsMergedDevBranch = require('./js/branch/getIsMergedDevBranch')
const getIsUpdatedInTime = require('./js/branch/getIsUpdatedInTime')
const { createArgs } = require('./js/tools')
const { defaults } = require('./js/global')

import {
    FetchDataType,
    GitmarsOptionOptionsType,
    CommandType
} from '../typings'

interface GitmBuildOption {
    dev?: boolean
    prod?: boolean
    build?: boolean | string
    commit?: boolean | string
    add?: boolean
    noBugfix?: boolean
    asFeature?: boolean
}

if (!isGitProject()) {
    sh.echo(error('当前目录不是git项目目录'))
    sh.exit(1)
}
const getUserToken = require('./js/api')
const getGitConfig = require('./js/getGitConfig')
const getConfig = require('./js/getConfig')
const { appName } = getGitConfig()
const config = getConfig()

/**
 * gitm combine
 */
program
    .name('gitm combine')
    .usage(
        '[type] [name] [-d --dev] [-p --prod] [-b --build [app]] [-a --add] [-m --commit <commit>] [--as-feature] [--no-bugfix]'
    )
    .description('合并bugfix任务分支、合并feature功能开发分支、合并support分支')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-d, --dev', '是否同步到alpha测试环境', false)
// .option('-p, --prod', '是否同步到预发布环境', false)
// .option('-b, --build [build]', '需要构建的应用')
// .option('-m, --commit <commit>', 'commit信息', '')
// .option('-a, --add', '需要add', false)
// .option('--no-bugfix', '不同步到bug分支')
// .option('--as-feature', 'bug分支合并到release')
program.action(
    async (type: string, name: string, opt: GitmBuildOption): Promise<void> => {
        const allow = ['bugfix', 'feature', 'support'] // 允许执行的指令
        const deny = [
            defaults.master,
            defaults.develop,
            defaults.release,
            defaults.bugfix,
            defaults.support
        ]
        const {
            token,
            level,
            nickname = ''
        } = config.api ? getUserToken() : ({} as FetchDataType)
        const status = !opt.add && opt.commit === '' ? getStatus() : true
        let _nameArr: string[] = [] // 分支名称数组
        if (!opt.dev && !opt.prod) {
            sh.echo('请输入需要同步到的环境')
            sh.exit(1)
        }
        if (!status) sh.exit(1)
        if (opt.commit === true) {
            sh.echo(error('请输入要提交的message'))
            sh.exit(1)
        }
        if (!type) {
            // type和name都没传且当前分支是开发分支
            ;[type, ..._nameArr] = getCurrent().split('/')
            name = _nameArr.join('/')
            if (!name) {
                deny.includes(type) &&
                    sh.echo(
                        error(`骚年，你在${type}分支执行这个指令是什么骚操作？`)
                    )
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
                ;[type, _nameArr] = branchs[0].split('/')
                name = _nameArr.join('/')
            } else {
                sh.echo(
                    branchs.length > 1
                        ? `查询到多条名称包含${type}的分支，请输入分支类型`
                        : error('分支不存在，请正确输入')
                )
                sh.exit(1)
            }
        }
        if (allow.includes(type) && name) {
            const base: string =
                type === 'bugfix' ? config.bugfix : config.release
            let cmd: Array<CommandType | string> = []
            // 获取一周内是否同步过上游分支代码
            if (
                !getIsUpdatedInTime({ lastet: '7d', limit: 100, branch: base })
            ) {
                sh.echo(
                    warning(
                        '检测到该分支已经超过1周没有同步过主干代码了，请每周至少同步一次，执行：gitm update'
                    )
                )
            }
            if (opt.add) {
                cmd = cmd.concat(['git add .'])
            }
            if (opt.commit) {
                cmd = cmd.concat([`git commit -m "${opt.commit}"`])
            }
            if (opt.dev) {
                cmd = cmd.concat([
                    'git fetch',
                    `git checkout ${config.develop}`,
                    'git pull',
                    {
                        cmd: `git merge --no-ff ${type}/${name}`,
                        config: {
                            again: false,
                            success: `${type}/${name}合并到${config.develop}成功`,
                            fail: `${type}/${name}合并到${config.develop}出错了，请根据提示处理`
                        }
                    },
                    {
                        cmd: 'git push',
                        config: {
                            again: true,
                            success: '推送成功',
                            fail: '推送失败，请根据提示处理'
                        }
                    },
                    `git checkout ${type}/${name}`
                ])
                if (opt.build) {
                    cmd = cmd.concat([
                        {
                            cmd: `gitm build ${appName} --env dev --app ${
                                opt.build === true ? 'all' : opt.build
                            }`,
                            config: {
                                again: false,
                                success: '调起构建成功',
                                fail: '调起构建失败'
                            }
                        }
                    ])
                }
            }
            // 开始合并到prod
            if (opt.prod) {
                // 判断是否同步过dev分支
                if (
                    !opt.dev &&
                    !getIsMergedDevBranch(`${type}/${name}`, config.develop)
                ) {
                    sh.echo(
                        warning(
                            `检测到你的分支没有合并过${config.develop}，请先合并到${config.develop}分支`
                        )
                    )
                } else {
                    // 同步到prod环境
                    if (!opt.noBugfix && !opt.asFeature) {
                        // 传入noBugfix不合bug,
                        cmd = cmd.concat(
                            !level || level < 3
                                ? [
                                      'git fetch',
                                      `git checkout ${base}`,
                                      'git pull',
                                      {
                                          cmd: `git merge --no-ff ${type}/${name}`,
                                          config: {
                                              again: false,
                                              success: `${type}/${name}合并到${base}成功`,
                                              fail: `${type}/${name}合并到${base}出错了，请根据提示处理`
                                          }
                                      },
                                      {
                                          cmd: 'git push',
                                          config: {
                                              again: true,
                                              success: '推送成功',
                                              fail: '推送失败，请根据提示处理'
                                          }
                                      },
                                      `git checkout ${type}/${name}`
                                  ]
                                : [
                                      {
                                          cmd: `git push --set-upstream origin ${type}/${name}`,
                                          config: {
                                              again: true,
                                              success:
                                                  '推送远程并关联远程分支成功',
                                              fail: '推送远程失败，请根据提示处理'
                                          }
                                      },
                                      {
                                          cmd: `curl -i -H "Content-Type: application/json" -X POST -d "{\u005c"source_branch\u005c":\u005c"${type}/${name}\u005c",\u005c"target_branch\u005c":\u005c"${base}\u005c",\u005c"private_token\u005c":\u005c"${token}\u005c",\u005c"title\u005c":\u005c"Merge branch '${type}/${name}' into '${base}'\u005c"}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`,
                                          config: {
                                              again: true,
                                              success: '成功创建合并请求',
                                              fail: '创建合并请求出错了，请根据提示处理'
                                          }
                                      },
                                      `gitm postmsg "${nickname}在${appName}项目提交了${type}/${name}分支合并到${base}分支的merge请求"`
                                  ]
                        )
                    }
                    // bugfix分支走release发布
                    if (type === 'bugfix' && opt.asFeature) {
                        cmd = cmd.concat(
                            !level || level < 3
                                ? [
                                      'git fetch',
                                      `git checkout ${config.release}`,
                                      'git pull',
                                      {
                                          cmd: `git merge --no-ff ${type}/${name}`,
                                          config: {
                                              again: false,
                                              success: `${type}/${name}合并到${config.release}成功`,
                                              fail: `${type}/${name}合并到${config.release}出错了，请根据提示处理`
                                          }
                                      },
                                      {
                                          cmd: 'git push',
                                          config: {
                                              again: true,
                                              success: '推送成功',
                                              fail: '推送失败，请根据提示处理'
                                          }
                                      },
                                      `git checkout ${type}/${name}`
                                  ]
                                : [
                                      {
                                          cmd: `git push --set-upstream origin ${type}/${name}`,
                                          config: {
                                              again: true,
                                              success:
                                                  '推送远程并关联远程分支成功',
                                              fail: '推送远程失败，请根据提示处理'
                                          }
                                      },
                                      {
                                          cmd: `curl -i -H "Content-Type: application/json" -X POST -d "{\u005c"source_branch\u005c":\u005c"${type}/${name}\u005c",\u005c"target_branch\u005c":\u005c"${config.release}\u005c",\u005c"private_token\u005c":\u005c"${token}\u005c",\u005c"title\u005c":\u005c"Merge branch '${type}/${name}' into '${config.release}'\u005c"}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`,
                                          config: {
                                              again: true,
                                              success: '成功创建合并请求',
                                              fail: '创建合并请求出错了，请根据提示处理'
                                          }
                                      },
                                      `gitm postmsg "${nickname}在${appName}项目提交了${type}/${name}分支合并到${config.release}分支的merge请求"`
                                  ]
                        )
                    }
                    // support分支需要合到bugfix
                    if (type === 'support' && opt.noBugfix) {
                        cmd = cmd.concat(
                            !level || level < 3
                                ? [
                                      'git fetch',
                                      `git checkout ${config.bugfix}`,
                                      'git pull',
                                      {
                                          cmd: `git merge --no-ff ${type}/${name}`,
                                          config: {
                                              again: false,
                                              success: `${type}/${name}合并到${config.bugfix}成功`,
                                              fail: `${type}/${name}合并到${config.bugfix}出错了，请根据提示处理`
                                          }
                                      },
                                      {
                                          cmd: 'git push',
                                          config: {
                                              again: true,
                                              success: '推送成功',
                                              fail: '推送失败，请根据提示处理'
                                          }
                                      },
                                      `git checkout ${type}/${name}`
                                  ]
                                : [
                                      {
                                          cmd: `git push --set-upstream origin ${type}/${name}`,
                                          config: {
                                              again: true,
                                              success:
                                                  '推送远程并关联远程分支成功',
                                              fail: '推送远程失败，请根据提示处理'
                                          }
                                      },
                                      {
                                          cmd: `curl -i -H "Content-Type: application/json" -X POST -d "{\u005c"source_branch\u005c":\u005c"${type}/${name}\u005c",\u005c"target_branch\u005c":\u005c"${config.bugfix}\u005c",\u005c"private_token\u005c":\u005c"${token}\u005c",\u005c"title\u005c":\u005c"Merge branch '${type}/${name}' into '${config.bugfix}'\u005c"}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`,
                                          config: {
                                              again: true,
                                              success: '成功创建合并请求',
                                              fail: '创建合并请求出错了，请根据提示处理'
                                          }
                                      },
                                      `gitm postmsg "${nickname}在${appName}项目提交了${type}/${name}分支合并到${config.bugfix}分支的merge请求"`
                                  ]
                        )
                    }
                    // 仅支持构建bug
                    if (opt.build && (!level || level < 3)) {
                        if (type === 'bugfix') {
                            cmd = cmd.concat([
                                {
                                    cmd: `gitm build ${appName} --env bug --app ${
                                        opt.build === true ? 'all' : opt.build
                                    }`,
                                    config: {
                                        again: false,
                                        success: '调起构建成功',
                                        fail: '调起构建失败'
                                    }
                                }
                            ])
                        }
                        // support分支要构建bug和release
                        if (type === 'support' && opt.noBugfix) {
                            cmd = cmd.concat([
                                {
                                    cmd: `gitm build ${appName} --env bug --app ${
                                        opt.build === true ? 'all' : opt.build
                                    }`,
                                    config: {
                                        again: false,
                                        success: '调起构建成功',
                                        fail: '调起构建失败'
                                    }
                                }
                            ])
                        }
                    }
                }
            }
            queue(cmd)
        } else {
            sh.echo(error('type只允许输入：' + JSON.stringify(allow)))
            sh.exit(1)
        }
    }
)
program.parse(process.argv)
export {}
