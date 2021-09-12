#!/usr/bin/env node
const { program } = require('commander')
const sh = require('shelljs')
const { options, args } = require('./conf/start')
const { error, success, queue, getStatus, isGitProject } = require('./js/index')
const { createArgs } = require('./js/tools')
if (!isGitProject()) {
    sh.echo(error('当前目录不是git项目目录'))
    sh.exit(1)
}
const getConfig = require('./js/getConfig')
const config = getConfig()

import { QueueReturnsType, GitmarsOptionOptionsType, CommandType } from '../typings'

/**
 * gitm start
 */
program.name('gitm start').usage('<type> <name>').description('创建bugfix任务分支、创建feature功能开发分支、support框架支持分支')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
program.action((type: string, name: string) => {
    const opts = ['bugfix', 'feature', 'support'] // 允许执行的指令
    const status = getStatus()
    if (!status) sh.exit(1)
    if (opts.includes(type)) {
        // feature从release拉取，bugfix从bug拉取，support从master分支拉取
        const base = type === 'bugfix' ? config.bugfix : type === 'support' ? config.master : config.release
        const cmd: Array<CommandType | string> = ['git fetch', `git checkout ${base}`, 'git pull', `git checkout -b ${type}/${name} ${base}`]
        queue(cmd).then((data: QueueReturnsType[]) => {
            if (data[3].code === 0) {
                sh.echo(`${name}分支创建成功，该分支基于${base}创建，您当前已经切换到${type}/${name}\n如果需要提测，请执行${success('gitm combine ' + type + ' ' + name)}\n开发完成后，记得执行: ${success('gitm end ' + type + ' ' + name)}`)
            }
        })
    } else {
        sh.echo(error('type只允许输入：' + JSON.stringify(opts)))
        sh.exit(1)
    }
})
program.parse(process.argv)
export {}
