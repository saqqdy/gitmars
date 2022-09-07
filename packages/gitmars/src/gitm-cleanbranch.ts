#!/usr/bin/env ts-node
import type {
    GitmarsBranchType,
    GitmarsOptionOptionsType,
    InitInquirerPromptType
} from '../typings'
const { program } = require('commander')
const { green, yellow, red } = require('chalk')
const inquirer = require('inquirer')
const ora = require('ora')
const getIsGitProject = require('@gitmars/core/lib/git/getIsGitProject')
const searchBranches = require('@gitmars/core/lib/git/searchBranches')
const getCurrentBranch = require('@gitmars/core/lib/git/getCurrentBranch')
const getIsMergedTargetBranch = require('@gitmars/core/lib/git/getIsMergedTargetBranch')
const getIsBranchOrCommitExist = require('@gitmars/core/lib/git/getIsBranchOrCommitExist')
const fetch = require('@gitmars/core/lib/git/fetch')
const { createArgs } = require('@gitmars/core/lib/utils/command')
const delay = require('@gitmars/core/lib/utils/delay')
const echo = require('@gitmars/core/lib/utils/echo')
const { spawnSync } = require('@gitmars/core/lib/spawn')
const getConfig = require('@gitmars/core/lib/getConfig')
const i18n = require('./locales')
if (!getIsGitProject()) {
    echo(red(i18n.__('The current directory is not a git project directory')))
    process.exit(1)
}
const { options, args } = require('./conf/cleanbranch')
const config = getConfig()
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
    .description(i18n.__('Clean up merged feature branches'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-l, --list', i18n.__('Show a list of branches that match the criteria'), false)
// .option('-t, --type [type]', i18n.__('The type of branch, there are 3 types: feature, bugfix, support, default all if not passed'), null)
// .option('--target [target]', i18n.__('The name of the target branch that needs to be tested for merging, default is develop and release if not passed'), null)
// .option('-k, --key [keyword]', i18n.__('Query branch for keywords'), null)
// .option('--exclude [exclude]', i18n.__('Exclude keywords'), '')
// .option('--include [include]', i18n.__('Include keywords'), '')
// .option('-r, --remote', i18n.__('Whether to clean up remote branches, default is clean up local branches'), false)
// .option('-c, --confirm', i18n.__('Confirm start, do not show confirmation box when true'), false)
// .option('--deadline [deadline]', '删除固定时长之前的分支，填写格式：10s/2m/2h/3d/4M/5y', '15d') -----------------------
program.action(async (branches: string[], opt: GitmBuildOption) => {
    const spinner = ora()
    spinner.color = 'green'
    const current = getCurrentBranch()

    // 执行清理
    async function clean(branch: string) {
        const removeLocal = getIsBranchOrCommitExist(branch)
        const removeRemote =
            opt.remote && getIsBranchOrCommitExist(branch, true)
        if (removeLocal || removeRemote) {
            spinner.start(green(`正在删除：${branch}`))
            await delay(200)
            spinner.succeed(green(`删除成功：${branch}`))
        }
        // 仅清理合过dev和release的分支
        if (removeLocal) {
            // 删除当前分支，需要切到其他分支去
            if (current === branch) {
                spawnSync('git', ['checkout', config.master])
            }
            spawnSync('git', ['branch', '-D', branch])
        }
        // 清理远程分支
        if (removeRemote) {
            spawnSync('git', ['push', 'origin', '--delete', branch])
        }
    }

    const targets = opt.target
        ? opt.target.split(',')
        : [config.develop, config.release]
    fetch()
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
                    message: i18n.__(
                        'About to start batch deleting branches, do you want to continue?'
                    ),
                    default: false
                })
                .then((answers: any) => {
                    if (!answers.value) {
                        echo(green('已退出'))
                        process.exit(0)
                    }
                })
        }
    } else {
        echo(green(i18n.__('No branches were queried.')))
        process.exit(0)
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
        spinner.start(green(`开始分析：${branch}`))
        const isMerged = getIsMergedTarget(branch, targets, opt.remote)
        if (!isMerged) {
            spinner.fail(red(`不可删除：${branch}`))
            continue
        }

        _willDeleteBranch.push(branch)
        await delay(200)
        spinner.succeed(green(`分析完成：${branch}`))
        if (opt.list) {
            continue
        }

        // 开始分支删除流程
        await clean(branch)
    }
    spinner.stop()
    // 打印列表
    if (opt.list) {
        if (_willDeleteBranch.length > 0) {
            console.info('\r')
            // 选择要清理的分支
            const prompt: InitInquirerPromptType = {
                type: 'checkbox',
                message: yellow(
                    `找到${_willDeleteBranch.length}条分支合并过${targets.join(
                        ','
                    )}分支，请选择要清理的分支`
                ),
                name: 'selectBranches',
                choices: []
            }
            _willDeleteBranch.forEach(item => {
                prompt.choices.push({
                    name: green(item),
                    value: item,
                    checked: true
                })
            })
            inquirer.prompt(prompt).then(({ selectBranches }: any) => {
                if (selectBranches.length === 0) {
                    echo(
                        yellow(
                            i18n.__(
                                'No branches were selected and the process has exited.'
                            )
                        )
                    )
                    process.exit(0)
                }
                selectBranches.forEach(async (branch: string) => {
                    // 开始分支删除流程
                    await clean(branch)
                })
            })
        } else {
            echo(green(i18n.__('Analysis complete, no branches to clean up')))
        }
    } else {
        echo(
            green(
                i18n.__(
                    'Deletion complete, these branches have been cleaned up'
                ) +
                    '：' +
                    _willDeleteBranch.join(' ')
            )
        )
    }
})

program.parse(process.argv)
export {}
