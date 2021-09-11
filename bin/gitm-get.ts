#!/usr/bin/env node
const { program } = require('commander')
const sh = require('shelljs')
const { options, args } = require('./conf/get')
const { error, queue, getCurrent, getStashList, warning, isGitProject } = require('./js/index')
const { createArgs } = require('./js/tools')
if (!isGitProject()) {
    sh.echo(error('当前目录不是git项目目录'))
    sh.exit(1)
}

import { GitmarsOptionOptionsType } from '../typings'

interface GitmBuildOption {
    keep: boolean
}

/**
 * gitm get
 */
program.name('gitm get').usage('[message] [index]').description('恢复暂存区文件')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-k, --keep [keep]', '保留暂存区不删除', false)
program.action(async (message: string, index: string, opt: GitmBuildOption) => {
    if (!message) message = getCurrent()
    const list = await getStashList(message)
    if (list.length === 0) sh.echo(warning('该分支没有暂存任何文件！'))
    if (index === undefined && list.length > 1) sh.echo(warning(`该分支下有${list.length}条暂存记录，默认恢复最近的一条记录`))
    if (list.length > 2) sh.echo(warning(`该分支下有${list.length}条暂存记录，建议定期清理不必要的暂存记录！`))
    queue([
        {
            cmd: `git stash ${opt.keep ? 'apply' : 'pop'} ${list[index || 0].key}`,
            config: {
                again: opt.keep ? false : `git stash drop ${list[index || 0].key}`,
                success: '文件恢复成功',
                fail: '恢复失败，请检查冲突'
            }
        }
    ])
})
program.parse(process.argv)
export {}
