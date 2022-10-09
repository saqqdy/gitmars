#!/usr/bin/env ts-node
import { program } from 'commander'
import sh from 'shelljs'
import chalk from 'chalk'
import getType from 'js-cool/es/getType'
import { queue } from '@gitmars/core/lib/queue'
import getIsGitProject from '@gitmars/core/lib/git/getIsGitProject'
import checkGitStatus from '@gitmars/core/lib/git/checkGitStatus'
import { createArgs } from '@gitmars/core/lib/utils/command'
import getConfig from '@gitmars/core/lib/getConfig'
import { isNeedUpgrade, upgradeGitmars } from '@gitmars/core/lib/versionControl'
import type {
    CommandType,
    GitmarsOptionOptionsType,
    QueueReturnsType
} from '../typings'
import lang from '#lib/common/local'
import startConfig from '#lib/conf/start'

const { t } = lang
const { green, red } = chalk
const { args, options } = startConfig

if (!getIsGitProject()) {
    sh.echo(red(t('The current directory is not a git project directory')))
    process.exit(1)
}

const config = getConfig()

interface GitmBuildOption {
    tag?: boolean
}

/**
 * gitm start
 */
program
    .name('gitm start')
    .usage('<type> <name> [-t --tag <tag>]')
    .description(
        t(
            'Create bugfix task branch, create feature development branch, support framework support branch'
        )
    )
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-t, --tag <tag>', t('Create branch from tag'), '')
program.action(async (type: string, name: string, opt: GitmBuildOption) => {
    // 检测是否需要升级版本
    const needUpgrade = await isNeedUpgrade()
    needUpgrade && upgradeGitmars()
    const opts = ['bugfix', 'feature', 'support'] // Permissible commands
    const status = checkGitStatus()
    if (!status) process.exit(1)
    if (opts.includes(type)) {
        // 指定从tag拉取分支时，仅支持创建bugfix分支
        if (opt.tag && type !== 'bugfix') {
            sh.echo(
                red(
                    t(
                        'Specify that only bugfix branch creation is supported when pulling branches from tag'
                    )
                )
            )
            process.exit(1)
        }
        // Verification of branch name specification
        if (config.nameValidator) {
            const reg =
                getType(config.nameValidator) === 'regexp'
                    ? config.nameValidator
                    : new RegExp(config.nameValidator)
            if (!reg.test(name)) {
                sh.echo(red(t('Branch name does not conform to specification')))
                process.exit(1)
            }
        }
        // replace th'/'
        name = name.replace(/^\//, '')
        // feature is pulled from the release, bugfix is pulled from the bug, and support is pulled from the master branch
        const base = opt.tag
            ? opt.tag
            : type === 'bugfix'
            ? config.bugfix
            : type === 'support'
            ? config.master
            : config.release
        const cmd: Array<CommandType | string> = opt.tag
            ? ['git fetch', `git checkout -b ${type}/${name} ${base}`]
            : [
                  'git fetch',
                  `git checkout ${base}`,
                  'git pull',
                  `git checkout -b ${type}/${name} ${base}`
              ]
        queue(cmd).then((data: any) => {
            if (
                (opt.tag && data[1].status === 0) ||
                (!opt.tag && data[3].status === 0)
            ) {
                sh.echo(
                    t(
                        'The branch was created successfully and is based on {source}. You have now switched to the {target} branch\nIf you need to test, please run: "{combine}"\nWhen development is complete, remember to run: "{end}"',
                        {
                            source: String(base),
                            target: name,
                            combine: green('gitm combine ' + type + ' ' + name),
                            end: green('gitm end ' + type + ' ' + name)
                        }
                    )
                )
            }
        })
    } else {
        sh.echo(red(t('type only allows input') + ': ' + JSON.stringify(opts)))
        process.exit(1)
    }
})
program.parse(process.argv)
export {}
