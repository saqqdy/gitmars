#!/usr/bin/env ts-node
const { program } = require('commander')
const sh = require('shelljs')
const { options, args } = require('./conf/start')
const { error, success, queue, getStatus, isGitProject } = require('./js/index')
const { createArgs } = require('./js/tools')
const getType = require('js-cool/lib/getType')
if (!isGitProject()) {
    sh.echo(error('当前目录不是git项目目录'))
    sh.exit(1)
}
const getConfig = require('./js/getConfig')
const config = getConfig()

import {
    QueueReturnsType,
    GitmarsOptionOptionsType,
    CommandType
} from '../typings'

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
program.action((type: string, name: string, opt: GitmBuildOption) => {
    const opts = ['bugfix', 'feature', 'support'] // 允许执行的指令
    const status = getStatus()
    if (!status) sh.exit(1)
    if (opts.includes(type)) {
        // 指定从tag拉取分支时，仅支持创建bugfix分支
        if (opt.tag && type !== 'bugfix') {
            sh.echo(error('指定从tag拉取分支时仅支持创建bugfix分支'))
            sh.exit(1)
        }
        // 校验分支名称规范
        if (config.nameValidator) {
            const reg =
                getType(config.nameValidator) === 'regexp'
                    ? config.nameValidator
                    : new RegExp(config.nameValidator)
            if (!reg.test(name)) {
                sh.echo(error('分支名称不符合规范'))
                sh.exit(1)
            }
        }
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
            if (data[3].code === 0) {
                sh.echo(
                    `${name}分支创建成功，该分支基于${base}创建，您当前已经切换到${type}/${name}\n如果需要提测，请执行${success(
                        'gitm combine ' + type + ' ' + name
                    )}\n开发完成后，记得执行: ${success(
                        'gitm end ' + type + ' ' + name
                    )}`
                )
            }
        })
    } else {
        sh.echo(error('type只允许输入：' + JSON.stringify(opts)))
        sh.exit(1)
    }
})
program.parse(process.argv)
export {}
