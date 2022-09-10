#!/usr/bin/env ts-node
import { program } from 'commander'
import sh from 'shelljs'
import chalk from 'chalk'
import { queue } from '@gitmars/core/lib/queue'
import getIsGitProject from '@gitmars/core/lib/git/getIsGitProject'
import getCurrentBranch from '@gitmars/core/lib/git/getCurrentBranch'
import getIsMergedTargetBranch from '@gitmars/core/lib/git/getIsMergedTargetBranch'
import checkGitStatus from '@gitmars/core/lib/git/checkGitStatus'
import searchBranches from '@gitmars/core/lib/git/searchBranches'
import { createArgs } from '@gitmars/core/lib/utils/command'
import getConfig from '@gitmars/core/lib/getConfig'
import { isNeedUpgrade, upgradeGitmars } from '@gitmars/core/lib/versionControl'
import type { CommandType, GitmarsOptionOptionsType } from '../typings'
import { defaults } from '#lib/common/global'
import updateConfig from '#lib/conf/update'
import i18n from '#lib/locales/index'

const { red } = chalk
const { args, options } = updateConfig

if (!getIsGitProject()) {
    sh.echo(
        red(i18n.__('The current directory is not a git project directory'))
    )
    process.exit(1)
}

const config = getConfig()

interface GitmBuildOption {
    useMerge?: boolean
    useRebase?: boolean
    all?: boolean
    force?: boolean
}

/**
 * gitm update
 */
program
    .name('gitm update')
    .usage('[type] [name] [--use-merge] [--use-rebase] [-a --all] [-f --force]')
    .description(
        i18n.__(
            'Update bug task branch, update feature function development branch, framework adjustment branch support'
        )
    )
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('--use-merge', '是否使用merge方式更新，默认merge方式', true)
// .option('--use-rebase', '是否使用rebase方式更新，默认merge方式', false)
// .option('-a --all', i18n.__('Update all local bugfix, feature, support branches'), false)
// .option('-f, --force', i18n.__('Whether to force a merge request'), false)
program.action(
    async (type: string | string[], name: string, opt: GitmBuildOption) => {
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
        const status = checkGitStatus()
        let cmds: Array<CommandType | string> = [],
            branchList = [],
            _nameArr: string[] = [] // 分支名称数组
        if (!status) process.exit(1)
        if (opt.all) {
            // 更新全部分支
            if (!type) type = allow.join(',')
            branchList = searchBranches({ type })
        } else if (!type || !name) {
            // type或name没传
            const current = getCurrentBranch()
            ;[type, ..._nameArr] = current.split('/')
            name = _nameArr.join('/')
            if (!name) {
                deny.includes(type) &&
                    sh.echo(
                        red(`骚年，你在${type}分支执行这个指令是什么骚操作？`)
                    )
                process.exit(1)
            }
            if (!allow.includes(type as string)) {
                // type不合法
                sh.echo(red(i18n.__('type only allows input') + ': ' + JSON.stringify(allow)))
                process.exit(1)
            }
            branchList = [].concat(current)
        } else if (!allow.includes(type as string)) {
            // 传了type和name，但是不合法
            sh.echo(red(i18n.__('type only allows input') + ': ' + JSON.stringify(allow)))
            process.exit(1)
        } else {
            // 传了正常的type和name
            branchList = [type + '/' + name]
        }
        branchList.forEach((branch: string) => {
            // feature从release拉取，bugfix从bug拉取，support从master分支拉取
            ;[type, ..._nameArr] = branch.split('/')
            name = _nameArr.join('/')
            const base: string =
                type === 'bugfix'
                    ? config.bugfix
                    : type === 'support'
                    ? config.master
                    : config.release
            const isNeedCombine = !getIsMergedTargetBranch(
                base,
                `${type}/${name}`,
                true
            )
            let cmd: Array<CommandType | string> = []
            if (isNeedCombine || opt.force) {
                cmd = cmd.concat([
                    'git fetch',
                    `git checkout ${base}`,
                    'git pull',
                    `git checkout ${type}/${name}`
                ])
                if (opt.useRebase) {
                    cmd.push({
                        cmd: `git rebase ${base}`,
                        config: {
                            again: false,
                            success: `${base}更新到${type}/${name}成功`,
                            fail: `${base}更新到${type}/${name}出错了，请根据提示处理`
                        }
                    })
                } else {
                    cmd.push({
                        cmd: `git merge --no-ff ${base}`,
                        config: {
                            again: false,
                            success: `${base}同步到${type}/${name}成功`,
                            fail: `${base}同步到${type}/${name}出错了，请根据提示处理`
                        }
                    })
                }
            } else {
                cmd = [
                    {
                        message: `${base}已经合并过${type}/${name}`
                    }
                ]
            }

            cmds = cmds.concat(cmd)
        })
        queue(cmds)
    }
)
program.parse(process.argv)
export {}
