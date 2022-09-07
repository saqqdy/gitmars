#!/usr/bin/env ts-node
import type {
    CommandType,
    FetchDataType,
    GitmarsOptionOptionsType
} from '../typings'
const { Command } = require('commander')
const { green, red } = require('chalk')
const getType = require('js-cool/lib/getType')
const getUserToken = require('@gitmars/core/lib/api/getUserToken')
const { queue } = require('@gitmars/core/lib/queue')
const getIsBranchOrCommitExist = require('@gitmars/core/lib/git/getIsBranchOrCommitExist')
const getIsGitProject = require('@gitmars/core/lib/git/getIsGitProject')
const getCurrentBranch = require('@gitmars/core/lib/git/getCurrentBranch')
const getGitConfig = require('@gitmars/core/lib/git/getGitConfig')
const getIsMergedTargetBranch = require('@gitmars/core/lib/git/getIsMergedTargetBranch')
const checkGitStatus = require('@gitmars/core/lib/git/checkGitStatus')
const fetch = require('@gitmars/core/lib/git/fetch')
const { createArgs } = require('@gitmars/core/lib/utils/command')
const { spawnSync } = require('@gitmars/core/lib/spawn')
const echo = require('@gitmars/core/lib/utils/echo')
const getConfig = require('@gitmars/core/lib/getConfig')
const i18n = require('./locales')
if (!getIsGitProject()) {
    echo(red(i18n.__('The current directory is not a git project directory')))
    process.exit(1)
}
const { create, publish, update, clean, approve } = require('./conf/admin')
const { appName } = getGitConfig()
const config = getConfig()
const userInfoApi =
    (config.apis && config.apis.userInfo && config.apis.userInfo.url) ||
    config.api
const mergeRequestModule = require.resolve('@gitmars/core/lib/api/mergeRequest')
interface GitmBuildOption {
    publish: {
        combine?: boolean
        useRebase?: boolean
        prod?: boolean
        build?: boolean | string
        description?: string
        postmsg?: boolean
        force?: boolean
    }
    update: {
        useRebase?: boolean
        mode?: 0 | 1 | 2
        description?: string
        postmsg?: boolean
        force?: boolean
    }
}

type PublishOptsType = 'bugfix' | 'support' | 'release'

/**
 * gitm admin create
 * gitm admin publish
 * gitm admin update
 * gitm admin clean
 * gitm admin approve
 */
const program = new Command()

const createProgram = program
    .name('gitm admin')
    .usage('<command> <type>')
    .description('创建bugfix、release、develop和support分支')
    .command('create ' + createArgs(create.args))
create.options.forEach((o: GitmarsOptionOptionsType) => {
    createProgram.option(o.flags, o.description, o.defaultValue)
})
// .command('create <type>')
createProgram.action((type: string): void => {
    const opts = ['bugfix', 'release', 'develop', 'support'] // 允许执行的指令
    const base: string = type === 'release' ? config.master : config.release
    const status = checkGitStatus()
    const hasBase = getIsBranchOrCommitExist(base)
    const exits = getIsBranchOrCommitExist(config[type])
    if (!status) process.exit(1)
    if (!hasBase) {
        echo(red(base + '分支不存在，请先创建' + base + '分支'))
        process.exit(1)
    }
    if (exits) {
        echo(red(config[type] + '分支已存在，不需要重复创建'))
        process.exit(1)
    }
    if (opts.includes(type)) {
        // release从master拉取，其他从release拉取
        const cmd = [
            'git fetch',
            `git checkout ${base}`,
            'git pull',
            `git checkout -b ${config[type]} ${base}`
        ]
        queue(cmd).then((data: any[]) => {
            if (data[3].status === 0) {
                echo(
                    `${
                        config[type]
                    }分支创建成功，该分支基于${base}创建，您当前已经切换到${
                        config[type]
                    }\n需要发版时，记得执行: ${green(
                        'gitm admin publish ' + config[type]
                    )}`
                )
            }
        })
    } else {
        echo(red('type只允许输入：' + opts.join(',')))
        process.exit(1)
    }
})

const publishProgram = program
    .name('gitm admin')
    .usage(
        '<command> <type> [--description [description]] [-c --combine] [--use-rebase] [-p --prod] [-b --build [app]] [--postmsg] [-f --force]'
    )
    .description('发布bugfix、release、support分支')
    .command('publish ' + createArgs(publish.args))
publish.options.forEach((o: GitmarsOptionOptionsType) => {
    publishProgram.option(o.flags, o.description, o.defaultValue)
})
// .command('publish <type>')
// .option('-c, --combine', i18n.__('Whether to sync the release code to the bug'), false)
// .option('--use-rebase', i18n.__('Whether to update using rebase method, default merge'), false)
// .option('-p, --prod', i18n.__('Whether to merge bugs to master when publishing bug branches'), false)
// .option('-b, --build [build]', '需要构建的应用')
// .option('--postmsg', i18n.__('Send Message'), false)
// .option('--description [description]', i18n.__('Description of the reason for this commit'), '')
// .option('-f, --force', i18n.__('Whether to force a merge request'), false)
publishProgram.action(
    async (
        type: PublishOptsType,
        opt: GitmBuildOption['publish']
    ): Promise<void> => {
        const {
            token,
            level,
            nickname = ''
        } = userInfoApi ? await getUserToken() : ({} as FetchDataType)
        const opts = ['bugfix', 'release', 'support'] // 允许执行的指令
        const status = checkGitStatus()
        const curBranch = await getCurrentBranch()
        let isDescriptionCorrect = true // 本次提交的原因描述是否符合规范
        if (!status) process.exit(1)
        fetch()
        // 有配置descriptionValidator时需要校验描述信息
        if (config.descriptionValidator) {
            // 校验本次提交的原因描述
            const reg =
                getType(config.descriptionValidator) === 'regexp'
                    ? config.descriptionValidator
                    : new RegExp(config.descriptionValidator)
            isDescriptionCorrect = opt.description && reg.test(opt.description)
        }
        const isNeedCombineBugfixToRelease = !getIsMergedTargetBranch(
            `origin/${config.bugfix}`,
            config.release,
            true
        )
        const isNeedCombineSupportToRelease = !getIsMergedTargetBranch(
            `origin/${config.support}`,
            config.release,
            true
        )
        const isNeedCombineSupportToBugfix = !getIsMergedTargetBranch(
            `origin/${config.support}`,
            config.bugfix,
            true
        )
        const isNeedCombineReleaseToMaster = !getIsMergedTargetBranch(
            `origin/${config.release}`,
            config.master,
            true
        )
        if (opts.includes(type)) {
            /**
             * bugfix -> master/release
             * release -> master
             * develop -> null
             * support -> bugfix/release
             */
            let cmd: {
                [prop in PublishOptsType]: Array<CommandType | string>
            }
            if (!level || level < 4) {
                cmd = {
                    bugfix:
                        isNeedCombineBugfixToRelease || opt.force
                            ? [
                                  'git fetch',
                                  `git checkout ${config.bugfix}`,
                                  'git pull',
                                  `git checkout ${config.release}`,
                                  'git pull',
                                  {
                                      cmd: `git merge --no-ff ${config.bugfix}`,
                                      config: {
                                          again: false,
                                          postmsg: opt.postmsg,
                                          success: `${config.bugfix}合并到${config.release}成功`,
                                          fail: `${config.bugfix}合并到${config.release}出错了，请根据提示处理`
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
                                  }
                              ]
                            : [
                                  {
                                      message: `${config.bugfix}已经合并过${config.release}`
                                  }
                              ],
                    support: ([] as Array<CommandType | string>)
                        .concat(
                            isNeedCombineSupportToRelease || opt.force
                                ? [
                                      'git fetch',
                                      `git checkout ${config.support}`,
                                      'git pull',
                                      `git checkout ${config.release}`,
                                      'git pull',
                                      {
                                          cmd: `git merge --no-ff ${config.support}`,
                                          config: {
                                              again: false,
                                              success: `${config.support}合并到${config.release}成功`,
                                              fail: `${config.support}合并到${config.release}出错了，请根据提示处理`
                                          }
                                      },
                                      {
                                          cmd: 'git push',
                                          config: {
                                              again: true,
                                              success:
                                                  i18n.__('Successful Pushed'),
                                              fail: i18n.__(
                                                  'Push failed, please follow the prompts'
                                              )
                                          }
                                      }
                                  ]
                                : [
                                      {
                                          message: `${config.support}已经合并过${config.release}`
                                      }
                                  ]
                        )
                        .concat(
                            isNeedCombineSupportToBugfix || opt.force
                                ? [
                                      `git checkout ${config.bugfix}`,
                                      'git pull',
                                      {
                                          cmd: `git merge --no-ff ${config.support}`,
                                          config: {
                                              again: false,
                                              success: `${config.support}合并到${config.bugfix}成功`,
                                              fail: `${config.support}合并到${config.bugfix}出错了，请根据提示处理`
                                          }
                                      },
                                      {
                                          cmd: 'git push',
                                          config: {
                                              again: true,
                                              success:
                                                  i18n.__('Successful Pushed'),
                                              fail: i18n.__(
                                                  'Push failed, please follow the prompts'
                                              )
                                          }
                                      }
                                  ]
                                : [
                                      {
                                          message: `${config.support}已经合并过${config.bugfix}`
                                      }
                                  ]
                        ),
                    release:
                        isNeedCombineReleaseToMaster || opt.force
                            ? [
                                  'git fetch',
                                  `git checkout ${config.release}`,
                                  'git pull',
                                  `git checkout ${config.master}`,
                                  'git pull',
                                  {
                                      cmd: `git merge --no-ff ${config.release}`,
                                      config: {
                                          again: false,
                                          success: `${config.release}合并到${config.master}成功`,
                                          fail: `${config.release}合并到${config.master}出错了，请根据提示处理`
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
                                  }
                              ]
                            : [
                                  {
                                      message: `${config.release}已经合并过${config.master}`
                                  }
                              ]
                }
            } else {
                if (!isDescriptionCorrect) {
                    echo(
                        red(
                            i18n.__(
                                'The description of the reason for submission does not meet the specification'
                            )
                        )
                    )
                    process.exit(1)
                }
                cmd = {
                    bugfix:
                        isNeedCombineBugfixToRelease || opt.force
                            ? [
                                  {
                                      cmd: {
                                          module: mergeRequestModule,
                                          entry: 'createMergeRequest',
                                          options: {
                                              source_branch: config.bugfix,
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
                                  `gitm postmsg "${nickname}在${appName}项目提交了${config.bugfix}分支合并到${config.release}分支的merge请求"`
                              ]
                            : [
                                  {
                                      message: `${config.bugfix}已经合并过${config.release}`
                                  }
                              ],
                    support: ([] as Array<CommandType | string>)
                        .concat(
                            isNeedCombineSupportToRelease || opt.force
                                ? [
                                      {
                                          cmd: {
                                              module: mergeRequestModule,
                                              entry: 'createMergeRequest',
                                              options: {
                                                  source_branch: config.support,
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
                                      `gitm postmsg "${nickname}在${appName}项目提交了${config.support}分支合并到${config.release}分支的merge请求"`
                                  ]
                                : [
                                      {
                                          message: `${config.support}已经合并过${config.release}`
                                      }
                                  ]
                        )
                        .concat(
                            isNeedCombineSupportToBugfix || opt.force
                                ? [
                                      {
                                          cmd: {
                                              module: mergeRequestModule,
                                              entry: 'createMergeRequest',
                                              options: {
                                                  source_branch: config.support,
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
                                      `gitm postmsg "${nickname}在${appName}项目提交了${config.support}分支合并到${config.bugfix}分支的merge请求"`
                                  ]
                                : [
                                      {
                                          message: `${config.support}已经合并过${config.bugfix}`
                                      }
                                  ]
                        ),
                    release:
                        isNeedCombineReleaseToMaster || opt.force
                            ? [
                                  {
                                      cmd: {
                                          module: mergeRequestModule,
                                          entry: 'createMergeRequest',
                                          options: {
                                              source_branch: config.release,
                                              target_branch: config.master,
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
                                  `gitm postmsg "${nickname}在${appName}项目提交了${config.release}分支合并到${config.master}分支的merge请求"`
                              ]
                            : [
                                  {
                                      message: `${config.release}已经合并过${config.master}`
                                  }
                              ]
                }
            }
            // 发布bug分支且同步到master
            if (type === 'bugfix' && opt.prod) {
                // 是否需要合并master
                const isNeedCombine = !getIsMergedTargetBranch(
                    `origin/${config.bugfix}`,
                    config.master,
                    true
                )
                if (!level || level < 4) {
                    cmd[type] = cmd[type].concat(
                        isNeedCombine || opt.force
                            ? [
                                  `git checkout ${config.master}`,
                                  'git pull',
                                  {
                                      cmd: `git merge --no-ff ${config.bugfix}`,
                                      config: {
                                          again: false,
                                          success: `${config.bugfix}合并到${config.master}成功`,
                                          fail: `${config.bugfix}合并到${config.master}出错了，请根据提示处理`
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
                                  }
                              ]
                            : [
                                  {
                                      message: `${config.bugfix}已经合并过${config.master}`
                                  }
                              ]
                    )
                } else {
                    if (!isDescriptionCorrect) {
                        echo(
                            red(
                                i18n.__(
                                    'The description of the reason for submission does not meet the specification'
                                )
                            )
                        )
                        process.exit(1)
                    }
                    cmd[type] = cmd[type].concat(
                        isNeedCombine || opt.force
                            ? [
                                  {
                                      cmd: {
                                          module: mergeRequestModule,
                                          entry: 'createMergeRequest',
                                          options: {
                                              source_branch: config.bugfix,
                                              target_branch: config.master,
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
                                  `gitm postmsg "${nickname}在${appName}项目提交了${config.bugfix}分支合并到${config.master}分支的merge请求"`
                              ]
                            : [
                                  {
                                      message: `${config.bugfix}已经合并过${config.master}`
                                  }
                              ]
                    )
                }
                if (opt.build && (!level || level < 4)) {
                    cmd[type] = cmd[type].concat([
                        {
                            cmd: `gitm build ${appName} --env bug --app ${
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
            // 发布release
            if (type === 'release' && opt.build && (!level || level < 4)) {
                cmd[type] = cmd[type].concat([
                    {
                        cmd: `gitm build ${appName} --env prod --app ${
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
            // 发布release分支且同步release代码到bug线
            if (type === 'release' && opt.combine) {
                // 是否需要合并bug
                const isNeedCombine = !getIsMergedTargetBranch(
                    `origin/${config.release}`,
                    config.bugfix,
                    true
                )
                // 使用rebase
                if (opt.useRebase) {
                    cmd[type] = cmd[type].concat(
                        isNeedCombine || opt.force
                            ? [
                                  `git checkout ${config.release}`,
                                  'git pull',
                                  `git checkout ${config.bugfix}`,
                                  {
                                      cmd: `git pull origin ${config.bugfix} --rebase`,
                                      config: { again: true }
                                  },
                                  {
                                      cmd: `git rebase ${config.release}`,
                                      config: {
                                          again: false,
                                          postmsg: opt.postmsg,
                                          success: `${config.release}同步到${config.bugfix}成功`,
                                          fail: `${config.release}同步到${config.bugfix}出错了，请根据提示处理`
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
                                  }
                              ]
                            : [
                                  {
                                      message: `${config.release}已经合并过${config.bugfix}`
                                  }
                              ]
                    )
                } else {
                    if (!level || level < 4) {
                        cmd[type] = cmd[type].concat(
                            isNeedCombine || opt.force
                                ? [
                                      `git checkout ${config.release}`,
                                      'git pull',
                                      `git checkout ${config.bugfix}`,
                                      'git pull',
                                      {
                                          cmd: `git merge --no-ff ${config.release}`,
                                          config: {
                                              again: false,
                                              postmsg: opt.postmsg,
                                              success: `${config.release}合并到${config.bugfix}成功`,
                                              fail: `${config.release}合并到${config.bugfix}出错了，请根据提示处理`
                                          }
                                      },
                                      {
                                          cmd: 'git push',
                                          config: {
                                              again: true,
                                              success:
                                                  i18n.__('Successful Pushed'),
                                              fail: i18n.__(
                                                  'Push failed, please follow the prompts'
                                              )
                                          }
                                      }
                                  ]
                                : [
                                      {
                                          message: `${config.release}已经合并过${config.bugfix}`
                                      }
                                  ]
                        )
                    } else {
                        if (!isDescriptionCorrect) {
                            echo(
                                red(
                                    i18n.__(
                                        'The description of the reason for submission does not meet the specification'
                                    )
                                )
                            )
                            process.exit(1)
                        }
                        cmd[type] = cmd[type].concat([
                            {
                                cmd: {
                                    module: mergeRequestModule,
                                    entry: 'createMergeRequest',
                                    options: {
                                        source_branch: config.release,
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
                            `gitm postmsg "${nickname}在${appName}项目提交了${config.release}分支合并到${config.bugfix}分支的merge请求"`
                        ])
                    }
                }
            }
            let key: keyof typeof cmd
            // 回到当前分支
            for (key in cmd) {
                cmd[key].push(`git checkout ${curBranch}`)
            }
            queue(cmd[type])
        } else {
            echo(red('type只允许输入：' + opts.join(',')))
            process.exit(1)
        }
    }
)

const updateProgram = program
    .name('gitm admin')
    .usage(
        '<command> <type> [-m --mode [mode]] [--description [description]] [--use-rebase] [--postmsg] [-f --force]'
    )
    .description('更新bugfix、release、support分支代码')
    .command('update ' + createArgs(update.args))
update.options.forEach((o: GitmarsOptionOptionsType) => {
    updateProgram.option(o.flags, o.description, o.defaultValue)
})
// .command('update <type>')
// .option('--use-rebase', i18n.__('Whether to update using rebase method, default merge'), false)
// .option('-m, --mode [mode]', i18n.__('In case of a conflict, whether to keep the incoming code or the current code; 1=use current 2=use incoming; default is 0=handle manually. This parameter must not be used with --use-rebase'), 0)
// .option('--postmsg', i18n.__('Send Message'), false)
// .option('--description [description]', i18n.__('Description of the reason for this commit'), '')
// .option('-f, --force', i18n.__('Whether to force a merge request'), false)
updateProgram.action(
    async (type: string, opt: GitmBuildOption['update']): Promise<void> => {
        const {
            token,
            level,
            nickname = ''
        } = userInfoApi ? await getUserToken() : ({} as FetchDataType)
        const opts = ['bugfix', 'release', 'support'] // 允许执行的指令
        const base = type === 'release' ? config.master : config.release
        const status = checkGitStatus()
        let mode = '', // 冲突时，保留哪方代码
            isDescriptionCorrect = true // 本次提交的原因描述是否符合规范
        if (!status) process.exit(1)
        // 有配置descriptionValidator时需要校验描述信息
        if (config.descriptionValidator) {
            // 校验本次提交的原因描述
            const reg =
                getType(config.descriptionValidator) === 'regexp'
                    ? config.descriptionValidator
                    : new RegExp(config.descriptionValidator)
            isDescriptionCorrect = opt.description && reg.test(opt.description)
        }
        if (opt.mode === 1) {
            mode = ' --strategy-option ours'
        } else if (opt.mode === 2) {
            mode = ' --strategy-option theirs'
        }
        fetch()
        if (opts.includes(type)) {
            // 是否需要合并
            const isNeedCombine = !getIsMergedTargetBranch(
                `origin/${base}`,
                config[type],
                true
            )
            let cmd
            if (isNeedCombine || opt.force) {
                if (!level || level < 4) {
                    cmd = [
                        'git fetch',
                        `git checkout ${base}`,
                        'git pull',
                        `git checkout ${config[type]}`,
                        {
                            cmd: 'git pull',
                            config: { again: true }
                        },
                        {
                            cmd: `git merge --no-ff ${base}${mode}`,
                            config: {
                                again: false,
                                postmsg: opt.postmsg,
                                success: `${base}同步到${config[type]}成功`,
                                fail: `${base}同步到${config[type]}出错了，请根据提示处理`
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
                        }
                    ]
                } else {
                    if (!isDescriptionCorrect) {
                        echo(
                            red(
                                i18n.__(
                                    'The description of the reason for submission does not meet the specification'
                                )
                            )
                        )
                        process.exit(1)
                    }
                    cmd = [
                        {
                            cmd: {
                                module: mergeRequestModule,
                                entry: 'createMergeRequest',
                                options: {
                                    source_branch: base,
                                    target_branch: config[type],
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
                        `gitm postmsg "${nickname}在${appName}项目提交了${base}分支合并到${config[type]}分支的merge请求"`
                    ]
                }
                if (opt.useRebase) {
                    cmd = [
                        'git fetch',
                        `git checkout ${base}`,
                        'git pull',
                        `git checkout ${config[type]}`,
                        {
                            cmd: `git pull origin ${config[type]} --rebase`,
                            config: { again: true }
                        },
                        {
                            cmd: `git rebase ${base}`,
                            config: {
                                again: false,
                                postmsg: opt.postmsg,
                                success: `${base}同步到${config[type]}成功`,
                                fail: `${base}同步到${config[type]}出错了，请根据提示处理`
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
                        }
                    ]
                }
            } else {
                cmd = [
                    {
                        message: `${base}已经合并过${config[type]}`
                    }
                ]
            }
            queue(cmd)
        } else {
            echo(red('type只允许输入：' + opts.join(',')))
            process.exit(1)
        }
    }
)

const cleanProgram = program
    .name('gitm admin')
    .usage('<command> <type>')
    .description('构建清理工作')
    .command('clean ' + createArgs(clean.args))
clean.options.forEach((o: GitmarsOptionOptionsType) => {
    cleanProgram.option(o.flags, o.description, o.defaultValue)
})
// .command('clean <type>')
cleanProgram.action((type: string): void => {
    const opts = ['bugfix', 'release', 'develop', 'master'] // 允许执行的指令
    const status = checkGitStatus()
    if (!status) process.exit(1)
    if (opts.includes(type)) {
        let cmd = [
            'git fetch',
            'git checkout . -f',
            'git clean -fd',
            `git checkout ${config.master}`,
            `git branch -D ${config[type]}`,
            {
                cmd: 'git remote prune origin',
                config: {
                    again: true,
                    success: i18n.__('Cleanup of remote branch was successful'),
                    fail: i18n.__(
                        'Failed to clean up remote branch, please follow the prompts'
                    )
                }
            },
            'git fetch',
            `git checkout ${config[type]}`,
            'git pull'
        ]
        if (type === 'master') {
            cmd = [
                'git checkout .',
                'git clean -fd',
                `git checkout ${config.master}`,
                'git clean -fd',
                'git fetch',
                'git pull'
            ]
        }
        queue(cmd)
    } else {
        echo(red('type只允许输入：' + opts.join(',')))
        process.exit(1)
    }
})

const approveProgram = program
    .name('gitm admin')
    .usage('[type] [-k --key [keyword]]')
    .description('批准合并请求')
    .command('approve ' + createArgs(approve.args))
approve.options.forEach((o: GitmarsOptionOptionsType) => {
    approveProgram.option(o.flags, o.description, o.defaultValue)
})
// .command('approve')
approveProgram.action((): void => {
    spawnSync('gitm', ['approve', '--state', 'opened'], { stdio: 'inherit' })
})

program.parse(process.argv)
export {}
