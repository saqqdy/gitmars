#!/usr/bin/env ts-node
import { createRequire } from 'node:module'
import { program } from 'commander'
import sh from 'shelljs'
import chalk from 'chalk'
import getType from 'js-cool/es/getType'
import { queue } from '@gitmars/core/lib/queue'
import getIsGitProject from '@gitmars/core/lib/git/getIsGitProject'
import getCurrentBranch from '@gitmars/core/lib/git/getCurrentBranch'
import getGitConfig from '@gitmars/core/lib/git/getGitConfig'
import getIsMergedTargetBranch from '@gitmars/core/lib/git/getIsMergedTargetBranch'
import getIsUpdatedInTime from '@gitmars/core/lib/git/getIsUpdatedInTime'
import checkGitStatus from '@gitmars/core/lib/git/checkGitStatus'
import searchBranches from '@gitmars/core/lib/git/searchBranches'
import { createArgs } from '@gitmars/core/lib/utils/command'
import { isNeedUpgrade, upgradeGitmars } from '@gitmars/core/lib/versionControl'
import getConfig from '@gitmars/core/lib/getConfig'
import getUserToken from '@gitmars/core/lib/api/getUserToken'
import type {
    CommandType,
    FetchDataType,
    GitmarsOptionOptionsType
} from '../typings'
import { defaults } from '#lib/common/global'
import i18n from '#lib/locales/index'
import combineConfig from '#lib/conf/combine'

const require = createRequire(import.meta.url)
const { red, yellow } = chalk

if (!getIsGitProject()) {
    sh.echo(
        red(i18n.__('The current directory is not a git project directory'))
    )
    process.exit(1)
}

const mergeRequestModule = require.resolve('@gitmars/core/lib/api/mergeRequest')

interface GitmBuildOption {
    dev?: boolean
    prod?: boolean
    build?: boolean | string
    commit?: boolean | string
    description?: string
    add?: boolean
    noBugfix?: boolean
    asFeature?: boolean
    force?: boolean
}

const { args, options } = combineConfig
const { appName } = getGitConfig()
const config = getConfig()

/**
 * gitm combine
 */
program
    .name('gitm combine')
    .usage(
        '[type] [name] [-d --dev] [-p --prod] [-b --build [app]] [-a --add] [-m --commit <commit>] [--description [description]] [--as-feature] [--no-bugfix] [-f --force]'
    )
    .description(
        i18n.__(
            'Merge bugfix task branch, merge feature development branch, merge support branch'
        )
    )
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-d, --dev', '是否同步到alpha测试环境', false)
// .option('-p, --prod', '是否同步到预发布环境', false)
// .option('-b, --build [build]', '需要构建的应用')
// .option('-m, --commit <commit>', 'commit信息', '')
// .option('--description [description]', i18n.__('Description of the reason for this commit'), '')
// .option('-a, --add', '需要add', false)
// .option('--no-bugfix', '不同步到bug分支')
// .option('--as-feature', i18n.__('bug branch merge to release'))
// .option('-f, --force', i18n.__('Whether to force a merge request'), false)
program.action(
    async (type: string, name: string, opt: GitmBuildOption): Promise<void> => {
        const userInfoApi =
            (config.apis && config.apis.userInfo && config.apis.userInfo.url) ||
            config.api
        // 检测是否需要升级版本
        const needUpgrade = await isNeedUpgrade()
        needUpgrade && upgradeGitmars()
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
        } = userInfoApi ? await getUserToken() : ({} as FetchDataType)
        const status = !opt.add && opt.commit === '' ? checkGitStatus() : true
        let _nameArr: string[] = [], // 分支名称数组
            isDescriptionCorrect = true // 本次提交的原因描述是否符合规范
        if (!opt.dev && !opt.prod) {
            sh.echo(i18n.__('Please enter the environment to sync to.'))
            process.exit(1)
        }
        if (!status) process.exit(1)
        if (opt.commit === true) {
            sh.echo(red(i18n.__('Please enter the message to be submitted')))
            process.exit(1)
        }
        // 有配置descriptionValidator时需要校验描述信息
        if (config.descriptionValidator) {
            // 校验本次提交的原因描述
            const reg =
                getType(config.descriptionValidator) === 'regexp'
                    ? config.descriptionValidator
                    : new RegExp(config.descriptionValidator)
            isDescriptionCorrect = opt.description && reg.test(opt.description)
        }
        if (!type) {
            // type和name都没传且当前分支是开发分支
            ;[type, ..._nameArr] = getCurrentBranch().split('/')
            name = _nameArr.join('/')
            if (!name) {
                deny.includes(type) &&
                    sh.echo(
                        red(`骚年，你在${type}分支执行这个指令是什么骚操作？`)
                    )
                process.exit(1)
            }
        } else if (!name) {
            // 传了type没传name
            if (allow.includes(type)) {
                sh.echo(i18n.__('Please enter branch name'))
                process.exit(1)
            }
            const branches = searchBranches({ type })
            if (branches.length === 1) {
                ;[type, _nameArr] = branches[0].split('/')
                name = _nameArr.join('/')
            } else {
                sh.echo(
                    branches.length > 1
                        ? `查询到多条名称包含${type}的分支，请输入分支类型`
                        : red(
                              i18n.__(
                                  'Branch does not exist, please enter it correctly'
                              )
                          )
                )
                process.exit(1)
            }
        }
        if (allow.includes(type) && name) {
            const base: string =
                type === 'bugfix' ? config.bugfix : config.release
            let cmd: Array<CommandType | string> = []
            // 获取一周内是否同步过上游分支代码
            if (
                !getIsUpdatedInTime({ lastet: '7d', limit: 1000, branch: base })
            ) {
                sh.echo(
                    yellow(
                        i18n.__(
                            'This branch has not been synced for more than 1 week, please sync it at least once a week, execute: gitm update'
                        )
                    )
                )
            }
            if (opt.add) {
                cmd = cmd.concat(['git add .'])
            }
            if (opt.commit) {
                cmd = cmd.concat([`git commit -m "${opt.commit}"`])
            }
            // 合并到dev分支
            if (opt.dev) {
                // 是否需要合并dev
                const isNeedCombineDevelop = !getIsMergedTargetBranch(
                    `${type}/${name}`,
                    config.develop,
                    true
                )
                cmd = cmd.concat(
                    isNeedCombineDevelop || opt.force
                        ? [
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
                                      success: i18n.__('Successful Pushed'),
                                      fail: i18n.__(
                                          'Push failed, please follow the prompts'
                                      )
                                  }
                              },
                              `git checkout ${type}/${name}`
                          ]
                        : [
                              {
                                  message: `${type}/${name}已经合并过${config.develop}`
                              }
                          ]
                )
                if (opt.build) {
                    cmd = cmd.concat([
                        {
                            cmd: `gitm build ${appName} --env dev --app ${
                                opt.build === true ? 'all' : opt.build
                            }`,
                            config: {
                                again: false,
                                success: i18n.__(
                                    'Pulling up the build was successful'
                                ),
                                fail: i18n.__('Failed to pull up the build')
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
                    !getIsMergedTargetBranch(
                        `${type}/${name}`,
                        config.develop,
                        true
                    )
                ) {
                    sh.echo(
                        yellow(
                            `检测到你的分支没有合并过${config.develop}，请先合并到${config.develop}分支`
                        )
                    )
                    process.exit(1)
                } else {
                    // 同步到prod环境
                    if (!opt.noBugfix && !opt.asFeature) {
                        // 传入noBugfix不合bug,
                        if (!level || level < 3) {
                            // 是否需要合并prod
                            const isNeedCombineProd = !getIsMergedTargetBranch(
                                `${type}/${name}`,
                                base,
                                true
                            )
                            cmd = cmd.concat(
                                isNeedCombineProd || opt.force
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
                                                  success:
                                                      i18n.__(
                                                          'Successful Pushed'
                                                      ),
                                                  fail: i18n.__(
                                                      'Push failed, please follow the prompts'
                                                  )
                                              }
                                          },
                                          `git checkout ${type}/${name}`
                                      ]
                                    : [
                                          {
                                              message: `${type}/${name}已经合并过${base}`
                                          }
                                      ]
                            )
                        } else {
                            if (!isDescriptionCorrect) {
                                sh.echo(
                                    red(
                                        i18n.__(
                                            'The description of the reason for submission does not meet the specification'
                                        )
                                    )
                                )
                                process.exit(1)
                            }
                            cmd = cmd.concat([
                                {
                                    cmd: `git push --set-upstream origin ${type}/${name}`,
                                    config: {
                                        again: true,
                                        success: i18n.__(
                                            'Push remote and associate remote branch successfully'
                                        ),
                                        fail: i18n.__(
                                            'Push remote failed, please follow the prompts'
                                        )
                                    }
                                },
                                {
                                    cmd: {
                                        module: mergeRequestModule,
                                        entry: 'createMergeRequest',
                                        options: {
                                            source_branch: `${type}/${name}`,
                                            target_branch: base,
                                            token,
                                            description: opt.description
                                        }
                                    },
                                    config: {
                                        again: true,
                                        success: i18n.__(
                                            'Successfully created merge request'
                                        ),
                                        fail: i18n.__(
                                            'There was an error creating the merge request, please follow the instructions'
                                        )
                                    }
                                },
                                `gitm postmsg "${nickname}在${appName}项目提交了${type}/${name}分支合并到${base}分支的merge请求"`
                            ])
                        }
                    }
                    // bugfix分支走release发布
                    if (type === 'bugfix' && opt.asFeature) {
                        if (!level || level < 3) {
                            // 是否需要合并prod
                            const isNeedCombineProd = !getIsMergedTargetBranch(
                                `${type}/${name}`,
                                config.release,
                                true
                            )
                            cmd = cmd.concat(
                                isNeedCombineProd || opt.force
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
                                                  success:
                                                      i18n.__(
                                                          'Successful Pushed'
                                                      ),
                                                  fail: i18n.__(
                                                      'Push failed, please follow the prompts'
                                                  )
                                              }
                                          },
                                          `git checkout ${type}/${name}`
                                      ]
                                    : [
                                          {
                                              message: `${type}/${name}已经合并过${config.release}`
                                          }
                                      ]
                            )
                        } else {
                            if (!isDescriptionCorrect) {
                                sh.echo(
                                    red(
                                        i18n.__(
                                            'The description of the reason for submission does not meet the specification'
                                        )
                                    )
                                )
                                process.exit(1)
                            }
                            cmd = cmd.concat([
                                {
                                    cmd: `git push --set-upstream origin ${type}/${name}`,
                                    config: {
                                        again: true,
                                        success: i18n.__(
                                            'Push remote and associate remote branch successfully'
                                        ),
                                        fail: i18n.__(
                                            'Push remote failed, please follow the prompts'
                                        )
                                    }
                                },
                                {
                                    cmd: {
                                        module: mergeRequestModule,
                                        entry: 'createMergeRequest',
                                        options: {
                                            source_branch: `${type}/${name}`,
                                            target_branch: config.release,
                                            token,
                                            description: opt.description
                                        }
                                    },
                                    config: {
                                        again: true,
                                        success: i18n.__(
                                            'Successfully created merge request'
                                        ),
                                        fail: i18n.__(
                                            'There was an error creating the merge request, please follow the instructions'
                                        )
                                    }
                                },
                                `gitm postmsg "${nickname}在${appName}项目提交了${type}/${name}分支合并到${config.release}分支的merge请求"`
                            ])
                        }
                    }
                    // support分支需要合到bugfix
                    if (type === 'support' && opt.noBugfix) {
                        if (!level || level < 3) {
                            // 是否需要合并prod
                            const isNeedCombineProd = !getIsMergedTargetBranch(
                                `${type}/${name}`,
                                config.bugfix,
                                true
                            )
                            cmd = cmd.concat(
                                isNeedCombineProd || opt.force
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
                                                  success:
                                                      i18n.__(
                                                          'Successful Pushed'
                                                      ),
                                                  fail: i18n.__(
                                                      'Push failed, please follow the prompts'
                                                  )
                                              }
                                          },
                                          `git checkout ${type}/${name}`
                                      ]
                                    : [
                                          {
                                              message: `${type}/${name}已经合并过${config.bugfix}`
                                          }
                                      ]
                            )
                        } else {
                            if (!isDescriptionCorrect) {
                                sh.echo(
                                    red(
                                        i18n.__(
                                            'The description of the reason for submission does not meet the specification'
                                        )
                                    )
                                )
                                process.exit(1)
                            }
                            cmd = cmd.concat([
                                {
                                    cmd: `git push --set-upstream origin ${type}/${name}`,
                                    config: {
                                        again: true,
                                        success: i18n.__(
                                            'Push remote and associate remote branch successfully'
                                        ),
                                        fail: i18n.__(
                                            'Push remote failed, please follow the prompts'
                                        )
                                    }
                                },
                                {
                                    cmd: {
                                        module: mergeRequestModule,
                                        entry: 'createMergeRequest',
                                        options: {
                                            source_branch: `${type}/${name}`,
                                            target_branch: config.bugfix,
                                            token,
                                            description: opt.description
                                        }
                                    },
                                    config: {
                                        again: true,
                                        success: i18n.__(
                                            'Successfully created merge request'
                                        ),
                                        fail: i18n.__(
                                            'There was an error creating the merge request, please follow the instructions'
                                        )
                                    }
                                },
                                `gitm postmsg "${nickname}在${appName}项目提交了${type}/${name}分支合并到${config.bugfix}分支的merge请求"`
                            ])
                        }
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
                                        success: i18n.__(
                                            'Pulling up the build was successful'
                                        ),
                                        fail: i18n.__(
                                            'Failed to pull up the build'
                                        )
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
                                        success: i18n.__(
                                            'Pulling up the build was successful'
                                        ),
                                        fail: i18n.__(
                                            'Failed to pull up the build'
                                        )
                                    }
                                }
                            ])
                        }
                    }
                }
            }
            queue(cmd)
        } else {
            sh.echo(red('type只允许输入：' + JSON.stringify(allow)))
            process.exit(1)
        }
    }
)
program.parse(process.argv)
export {}
