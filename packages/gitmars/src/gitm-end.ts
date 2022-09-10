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
import getIsBranchOrCommitExist from '@gitmars/core/lib/git/getIsBranchOrCommitExist'
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
import endConfig from '#lib/conf/end'
import i18n from '#lib/locales/index'

const require = createRequire(import.meta.url)
const { args, options } = endConfig
const { red } = chalk

if (!getIsGitProject()) {
    sh.echo(
        red(i18n.__('The current directory is not a git project directory'))
    )
    process.exit(1)
}

const config = getConfig()
const { appName } = getGitConfig()
const mergeRequestModule = require.resolve('@gitmars/core/lib/api/mergeRequest')

interface GitmBuildOption {
    combine?: boolean
    asFeature?: boolean
    description?: string
}

/**
 * gitm end
 */
program
    .name('gitm end')
    .usage(
        '[type] [name] [--description [description]] [--as-feature] [--no-combine]'
    )
    .description(
        i18n.__(
            'Merge bugfix task branch, merge feature function development branch, the corresponding branch will be deleted after the merge is completed'
        )
    )
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('--no-combine', i18n.__('Do not merge trunk branches (make sure the branch is live)'))
// .option('--as-feature', i18n.__('bug branch merge to release'))
// .option('--description [description]', i18n.__('Description of the reason for this commit'), '')
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
        const status = checkGitStatus()
        let _nameArr: string[] = [], // 分支名称数组
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
                ;[type, ..._nameArr] = branches[0].split('/')
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
        const isRemoteBranchExist = getIsBranchOrCommitExist(
            `${type}/${name}`,
            true
        )
        if (allow.includes(type) && name) {
            const base: string = opt.asFeature
                ? config.release
                : type === 'bugfix'
                ? config.bugfix
                : config.release
            let cmd: Array<CommandType | string> = []
            // 是否需要合并dev
            const isNeedCombineDevelop = !getIsMergedTargetBranch(
                `${type}/${name}`,
                config.develop,
                true
            )
            // 是否需要合并base
            const isNeedCombineBase = !getIsMergedTargetBranch(
                `${type}/${name}`,
                base,
                true
            )
            // 是否需要合并bug
            const isNeedCombineBugfix = !getIsMergedTargetBranch(
                `${type}/${name}`,
                config.bugfix,
                true
            )
            if (opt.combine && isNeedCombineDevelop) {
                // 需要合并代码到dev
                cmd = [
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
            }
            // support分支需要合到bugfix
            if (type === 'support' && opt.combine && isNeedCombineBugfix) {
                if (!level || level < 3) {
                    cmd = cmd.concat([
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
                                success: i18n.__('Successful Pushed'),
                                fail: i18n.__(
                                    'Push failed, please follow the prompts'
                                )
                            }
                        },
                        `git checkout ${type}/${name}`
                    ])
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
            if (!opt.combine || !isNeedCombineBase) {
                // 不合并代码
                cmd = cmd.concat([
                    `git checkout ${config.develop}`,
                    `git branch -D ${type}/${name}`,
                    {
                        cmd: 'git remote prune origin',
                        config: {
                            again: true,
                            success: i18n.__(
                                'Cleanup of remote branch was successful'
                            ),
                            fail: i18n.__(
                                'Failed to clean up remote branch, please follow the prompts'
                            )
                        }
                    }
                ])
                // 判断远程是否存在分支
                if (isRemoteBranchExist) {
                    cmd = cmd.concat([
                        {
                            cmd: `git push origin --delete ${type}/${name}`,
                            config: {
                                again: true,
                                success: i18n.__(
                                    'Successfully deleted remote branch'
                                ),
                                fail: i18n.__(
                                    'Deletion failed, please contact administrator'
                                )
                            }
                        }
                    ])
                }
            } else {
                // 需要合并代码
                if (!level || level < 3) {
                    cmd = cmd.concat([
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
                                success: i18n.__('Successful Pushed'),
                                fail: i18n.__(
                                    'Push failed, please follow the prompts'
                                )
                            }
                        },
                        `git checkout ${config.develop}`,
                        `git branch -D ${type}/${name}`,
                        {
                            cmd: 'git remote prune origin',
                            config: {
                                again: true,
                                success: i18n.__(
                                    'Cleanup of remote branch was successful'
                                ),
                                fail: i18n.__(
                                    'Failed to clean up remote branch, please follow the prompts'
                                )
                            }
                        }
                    ])
                    // 判断远程是否存在分支
                    if (isRemoteBranchExist) {
                        cmd = cmd.concat([
                            {
                                cmd: `git push origin --delete ${type}/${name}`,
                                config: {
                                    again: true,
                                    success: i18n.__(
                                        'Successfully deleted remote branch'
                                    ),
                                    fail: i18n.__(
                                        'Deletion failed, please contact administrator'
                                    )
                                }
                            }
                        ])
                    }
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
            queue(cmd)
        } else {
            sh.echo(red('type只允许输入：' + JSON.stringify(allow)))
            process.exit(1)
        }
    }
)
program.parse(process.argv)
export {}
