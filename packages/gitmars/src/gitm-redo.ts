#!/usr/bin/env ts-node
import type {
    CommandType,
    GitmarsOptionOptionsType,
    InitInquirerPromptType,
    RevertCacheType
} from '../typings'
const { program } = require('commander')
const dayjs = require('dayjs')
const inquirer = require('inquirer')
const sh = require('shelljs')
const { yellow, blue, green, red } = require('colors')
const { queue } = require('@gitmars/core/queue')
const getIsGitProject = require('@gitmars/core/git/getIsGitProject')
const getCurrentBranch = require('@gitmars/core/git/getCurrentBranch')
const {
    getRevertCache,
    delRevertCache
} = require('@gitmars/core/cache/revertCache')
const { createArgs } = require('@gitmars/core/utils/command')
const echo = require('@gitmars/core/utils/echo')
const { options, args } = require('./conf/redo')
if (!getIsGitProject()) {
    sh.echo(red('当前目录不是git项目目录'))
    process.exit(1)
}
interface GitmBuildOption {
    branch?: string
    mode?: 1 | 2
}

/**
 * gitm redo
 */
program
    .name('gitm redo')
    .usage('[commitid...] [-m --mode [mode]]')
    .description('撤销一次提交记录')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .arguments('[commitid...]')
// .option('-m, --mode [mode]', '针对撤销一次merge记录，需要传入类型：1 = 保留当前分支代码，2 = 保留传入代码', null)
program.action(async (commitid: string[], opt: GitmBuildOption) => {
    const current = getCurrentBranch()
    let revertCache: RevertCacheType[] = getRevertCache(current),
        cmd: Array<CommandType | string> = [],
        commitIDs: string[] = [], // 需要恢复的commitID
        mode = ''
    mode = ' -m ' + Math.abs(Number(opt.mode || 1))
    if (commitid.length > 0) {
        // 传入了commitIDs
        revertCache = revertCache.filter(item =>
            commitid.some(id => item.after['%H']!.includes(id))
        )
    }
    // 没有查询到日志
    if (revertCache.length === 0) {
        // 没有查找到任何记录
        echo(yellow('没有找到可恢复的撤销记录，进程已退出'))
        process.exit(0)
    }
    // 多条记录
    const prompt: InitInquirerPromptType = {
        type: 'checkbox',
        message: '请选择要恢复的撤销记录',
        name: 'commitIDs',
        choices: []
    }
    revertCache.forEach(({ after }, index) => {
        const _time = dayjs(after['%aI']).format('YYYY/MM/DD HH:mm')
        prompt.choices.push({
            name: `${green(index + 1 + '.')} ${green(after['%s'])} | ${yellow(
                after['%an']
            )} | ${blue(_time)}`,
            value: after['%H'],
            checked: false
        })
    })
    commitIDs = (await inquirer.prompt(prompt)).commitIDs
    // 没有选择任何记录
    if (commitIDs.length === 0) {
        echo(yellow('没有选择任何记录，进程已退出'))
        process.exit(0)
    }
    // 筛选被选择的记录
    revertCache = revertCache.filter(item =>
        commitIDs.includes(item.after['%H']!)
    )
    cmd = revertCache.map(item => ({
        cmd: `git revert -s --no-edit ${item.after['%H']}${mode}`,
        config: {
            again: false,
            success: `撤销成功：${item.after['%s']}`,
            fail: '出错了，请根据提示处理'
        }
    }))
    // 执行
    queue(cmd).then(() => {
        delRevertCache(commitIDs)
    })
})
program.parse(process.argv)
export {}
