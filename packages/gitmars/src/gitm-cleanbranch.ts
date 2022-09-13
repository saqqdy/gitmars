#!/usr/bin/env ts-node
import { program } from 'commander'
import chalk from 'chalk'
import inquirer from 'inquirer'
import ora from 'ora'
import getIsGitProject from '@gitmars/core/lib/git/getIsGitProject'
import searchBranches from '@gitmars/core/lib/git/searchBranches'
import getCurrentBranch from '@gitmars/core/lib/git/getCurrentBranch'
import getIsMergedTargetBranch from '@gitmars/core/lib/git/getIsMergedTargetBranch'
import getIsBranchOrCommitExist from '@gitmars/core/lib/git/getIsBranchOrCommitExist'
import fetch from '@gitmars/core/lib/git/fetch'
import { createArgs } from '@gitmars/core/lib/utils/command'
import delay from '@gitmars/core/lib/utils/delay'
import echo from '@gitmars/core/lib/utils/echo'
import { spawnSync } from '@gitmars/core/lib/spawn'
import getConfig from '@gitmars/core/lib/getConfig'
import type {
    GitmarsBranchType,
    GitmarsOptionOptionsType,
    InitInquirerPromptType
} from '../typings'
import cleanbranchConfig from '#lib/conf/cleanbranch'
import i18n from '#lib/locales/index'

const { green, red, yellow } = chalk
const { args, options } = cleanbranchConfig

if (!getIsGitProject()) {
    echo(red(i18n.__('The current directory is not a git project directory')))
    process.exit(1)
}

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
 * Determine if it has been merged
 *
 * @param branch - branch name
 * @param targets - Target branch, array or string
 * @param remote - Whether to determine the origin branch
 * @returns isMergedTarget - return true | false
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
// .option('--deadline [deadline]', i18n.__('Delete branch before fixed duration, fill in format: 10s/2m/2h/3d/4M/5y'), '15d') -----------------------
program.action(async (branches: string[], opt: GitmBuildOption) => {
    const spinner = ora()
    spinner.color = 'green'
    const current = getCurrentBranch()

    // clean files
    async function clean(branch: string) {
        const removeLocal = getIsBranchOrCommitExist(branch)
        const removeRemote =
            opt.remote && getIsBranchOrCommitExist(branch, true)
        if (removeLocal || removeRemote) {
            spinner.start(
                green(i18n.__('Deleting: {{something}}', { something: branch }))
            )
            await delay(200)
            spinner.succeed(
                green(
                    i18n.__('Deleted successfully: {{something}}', {
                        something: branch
                    })
                )
            )
        }
        // Clean up only branches that have been combined with dev and release
        if (removeLocal) {
            // Delete the current branch, you need to cut to another branch
            if (current === branch) {
                spawnSync('git', ['checkout', config.master])
            }
            spawnSync('git', ['branch', '-D', branch])
        }
        // Clean up remote branches
        if (removeRemote) {
            spawnSync('git', ['push', 'origin', '--delete', branch])
        }
    }

    const targets = opt.target
        ? opt.target.split(',')
        : [config.develop, config.release]
    fetch()
    // No branch is passed in for the specified query
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
                        echo(green(i18n.__('exited')))
                        process.exit(0)
                    }
                })
        }
    } else {
        echo(green(i18n.__('No branches were queried.')))
        process.exit(0)
    }
    for (const branch of branches) {
        // Skip main Branches
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
        spinner.start(
            green(
                i18n.__('Start analysis: {{something}}', {
                    something: branch
                })
            )
        )
        const isMerged = getIsMergedTarget(branch, targets, opt.remote)
        if (!isMerged) {
            spinner.fail(
                red(
                    i18n.__('Cannot be deleted: {{something}}', {
                        something: branch
                    })
                )
            )
            continue
        }

        _willDeleteBranch.push(branch)
        await delay(200)
        spinner.succeed(
            green(
                i18n.__('Analysis completed: {{something}}', {
                    something: branch
                })
            )
        )
        if (opt.list) {
            continue
        }

        // deleting
        await clean(branch)
    }
    spinner.stop()

    if (opt.list) {
        if (_willDeleteBranch.length > 0) {
            console.info('\r')
            // Select the branch to clean
            const prompt: InitInquirerPromptType = {
                type: 'checkbox',
                message: yellow(
                    i18n.__(
                        'Find {{total}} branches merged over {{branches}} branch, please select the branch to clean up',
                        {
                            branches: targets.join(','),
                            total: String(_willDeleteBranch.length)
                        }
                    )
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
