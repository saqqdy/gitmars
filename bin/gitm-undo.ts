#!/usr/bin/env ts-node
const { program } = require('commander')
const dayjs = require('dayjs')
const inquirer = require('inquirer')
const sh = require('shelljs')
const { yellow, blue, green, red } = require('colors')
const { options, args } = require('./conf/undo')
const { queue } = require('./core/queue')
const {
    getIsGitProject,
    getGitLogs,
    getGitLogsByCommitIDs
} = require('./core/git/index')
const { getRevertCache, addRevertCache } = require('./core/cache/index')
const { createArgs, echo } = require('./core/utils/index')
if (!getIsGitProject()) {
    sh.echo(red('当前目录不是git项目目录'))
    process.exit(1)
}

import {
    GitLogsType,
    GitmarsOptionOptionsType,
    CommandType,
    InitInquirerPromptType,
    RevertCacheType
} from '../typings'

interface GitmBuildOption {
    mode: 1 | 2
    merges: boolean
    lastet: string
    limit: number
}

/**
 * 检测要撤销的commit
 *
 * @param commitIDs - 提交ID
 * @param mode - 模式
 * @returns status - 返回状态
 */
function getRevertCommitIDs(commitIDs: string[]): string[] {
    const revertCache = getRevertCache()
    let len = commitIDs.length
    while (len--) {
        const _before = revertCache.findIndex(
            (item: RevertCacheType) => item.before['%H'] === commitIDs[len]
        )
        const _after = revertCache.findIndex(
            (item: RevertCacheType) => item.after['%H'] === commitIDs[len]
        )
        if (_before > -1 || _after > -1) {
            echo(
                yellow(
                    _before > -1
                        ? `检测到 ${commitIDs[len]} 这条记录撤销过一次，请检查是否有误！`
                        : `检测到 ${commitIDs[len]} 这条记录是一条revert记录，请使用gitm redo操作！`
                )
            )
            commitIDs.splice(len, 1)
        }
    }
    return commitIDs
}

/**
 * gitm undo
 */
program
    .name('gitm undo')
    .usage(
        '[commitid...] [--lastet [lastet]] [--limit [limit]] [-m --mode [mode]] [--no-merges]'
    )
    .description('撤销一次提交记录')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .arguments('[commitid...]')
// .option('--no-merges', '是否排除merge的日志')
// .option('-m, --mode [mode]', '针对撤销一次merge记录，需要传入类型：1 = 保留当前分支代码，2 = 保留传入代码', 1)
// .option('--lastet [lastet]', '查询在某个时间之后的日志，填写格式：10s/2m/2h/3d/4M/5y', '7d')
// .option('--limit [limit]', '最多查询的日志条数', 20)
program.action(async (commitid: string[], opt: GitmBuildOption) => {
    const keys = ['%H', '%T', '%P', '%aI', '%an', '%s', '%b'] as const
    let logList: Array<
            {
                [key in typeof keys[number]]: string
            } & GitLogsType
        > = [],
        cmd: Array<CommandType | string> = [],
        commitIDs: string[] = [], // 需要执行的commitID
        mode = ''
    if (!opt.limit) opt.limit = 20
    if (opt.mode) mode = ' -m ' + Math.abs(Number(opt.mode))
    if (commitid.length > 0) {
        // 传入了commitIDs
        logList = getGitLogsByCommitIDs({ commitIDs: commitid, keys })
    } else {
        // 没有传入commitIDs，展示日志列表给用户选择
        logList = getGitLogs({
            lastet: opt.lastet,
            limit: opt.limit,
            noMerges: !opt.merges,
            keys
        })
        // 没有查询到日志
        if (logList.length === 0) {
            // 没有查找到任何记录
            echo(
                yellow(
                    '没有找到符合条件的commit记录，请适当放宽筛选条件，默认："--lastet=7d --limit=20"。进程已退出'
                )
            )
            process.exit(0)
        } else {
            // 多条记录
            const prompt: InitInquirerPromptType = {
                type: 'checkbox',
                message: '请选择要撤销的commit记录',
                name: 'commitIDs',
                choices: []
            }
            logList.forEach((log, index) => {
                const _time = dayjs(log['%aI']).format('YYYY/MM/DD HH:mm')
                prompt.choices.push({
                    name: `${green(index + 1 + '.')} ${green(
                        log['%s']
                    )} | ${yellow(log['%an'])} | ${blue(_time)}`,
                    value: log['%H'],
                    checked: false
                })
            })
            commitIDs = (await inquirer.prompt(prompt)).commitIDs
        }
    }
    // 没有选择任何记录
    if (commitIDs.length === 0) {
        echo(yellow('没有选择commit记录，进程已退出'))
        process.exit(0)
    }
    // 获取没有被undo过的记录
    commitIDs = getRevertCommitIDs(commitIDs)
    if (commitIDs.length === 0) {
        echo(yellow('没有可撤销的记录，进程已退出'))
        process.exit(0)
    }
    // 筛选被选择的记录
    logList = logList.filter(log => commitIDs.includes(log['%H']))
    cmd = logList.map(log => ({
        cmd: `git revert -s --no-edit ${log['%H']}${mode}`,
        config: {
            again: true,
            success: `撤销成功：${log['%s']}`,
            fail: '出错了，请根据提示处理'
        }
    }))
    // 执行
    queue(cmd).then(() => {
        const revertCacheList = logList.map(log => {
            const cache = { before: log, after: null }
            const _logs = getGitLogs({
                lastet: '1d',
                limit: opt.limit * 2,
                noMerges: true,
                keys,
                grep: log['%H']
            })
            if (_logs.length > 0) cache.after = _logs[0]
            return cache
        })
        addRevertCache(revertCacheList)
    })
})

program.parse(process.argv)
export {}
