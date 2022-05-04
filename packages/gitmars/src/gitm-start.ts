#!/usr/bin/env ts-node
import type {
    CommandType,
    GitmarsOptionOptionsType,
    QueueReturnsType
} from '../typings'
const { program } = require('commander')
const sh = require('shelljs')
const { green, red } = require('colors')
const getType = require('js-cool/lib/getType')
const { queue } = require('@gitmars/core/lib/queue')
const getIsGitProject = require('@gitmars/core/lib/git/getIsGitProject')
const checkGitStatus = require('@gitmars/core/lib/git/checkGitStatus')
const {
    isNeedUpgrade,
    upgradeGitmars
} = require('@gitmars/core/lib/versionControl')
const { createArgs } = require('@gitmars/core/lib/utils/command')
if (!getIsGitProject()) {
    sh.echo(red('当前目录不是git项目目录'))
    process.exit(1)
}
const getConfig = require('@gitmars/core/lib/getConfig')
const { options, args } = require('./conf/start')
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
        '创建bugfix任务分支、创建feature功能开发分支、support框架支持分支'
    )
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-t, --tag <tag>', '从tag创建分支', '')
program.action(async (type: string, name: string, opt: GitmBuildOption) => {
    // 检测是否需要升级版本
    const needUpgrade = await isNeedUpgrade()
    needUpgrade && upgradeGitmars()
    const opts = ['bugfix', 'feature', 'support'] // 允许执行的指令
    const status = checkGitStatus()
    if (!status) process.exit(1)
    if (opts.includes(type)) {
        // 指定从tag拉取分支时，仅支持创建bugfix分支
        if (opt.tag && type !== 'bugfix') {
            sh.echo(red('指定从tag拉取分支时仅支持创建bugfix分支'))
            process.exit(1)
        }
        // 校验分支名称规范
        if (config.nameValidator) {
            const reg =
                getType(config.nameValidator) === 'regexp'
                    ? config.nameValidator
                    : new RegExp(config.nameValidator)
            if (!reg.test(name)) {
                sh.echo(red('分支名称不符合规范'))
                process.exit(1)
            }
        }
        // 替换开头的'/'
        name = name.replace(/^\//, '')
        // feature从release拉取，bugfix从bug拉取，support从master分支拉取
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
        queue(cmd).then((data: QueueReturnsType[]) => {
            if (
                (opt.tag && data[1].status === 0) ||
                (!opt.tag && data[3].status === 0)
            ) {
                sh.echo(
                    `${name}分支创建成功，该分支基于${base}创建，您当前已经切换到${type}/${name}\n如果需要提测，请执行${green(
                        'gitm combine ' + type + ' ' + name
                    )}\n开发完成后，记得执行: ${green(
                        'gitm end ' + type + ' ' + name
                    )}`
                )
            }
        })
    } else {
        sh.echo(red('type只允许输入：' + JSON.stringify(opts)))
        process.exit(1)
    }
})
program.parse(process.argv)
export {}
