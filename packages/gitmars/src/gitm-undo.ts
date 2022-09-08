#!/usr/bin/env ts-node
import { program } from 'commander'
import dayjs from 'dayjs'
import inquirer from 'inquirer'
import sh from 'shelljs'
import { blue, green, red, yellow } from 'chalk'
import { queue } from '@gitmars/core/lib/queue'
import getIsGitProject from '@gitmars/core/lib/git/getIsGitProject'
import getGitLogs from '@gitmars/core/lib/git/getGitLogs'
import getGitLogsByCommitIDs from '@gitmars/core/lib/git/getGitLogsByCommitIDs'
import getCurrentBranch from '@gitmars/core/lib/git/getCurrentBranch'
import { createArgs } from '@gitmars/core/lib/utils/command'
import echo from '@gitmars/core/lib/utils/echo'
import {
    addRevertCache,
    getRevertCache,
    setRevertCache
} from '@gitmars/core/lib/cache/revertCache'
import type {
    CommandType,
    GitLogsType,
    GitmarsOptionOptionsType,
    InitInquirerPromptType,
    RevertCacheType
} from '../typings'
import i18n from './locales'
import undoConfig from './conf/undo'

if (!getIsGitProject()) {
    sh.echo(
        red(i18n.__('The current directory is not a git project directory'))
    )
    process.exit(1)
}

const { args, options } = undoConfig

interface GitmBuildOption {
    mode: 1 | 2
    merges: boolean
    lastet: string
    limit: number
    calc: boolean
    calcAll: boolean
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
    const current = getCurrentBranch()
    let len = commitIDs.length
    while (len--) {
        const _before = revertCache.findIndex(
            (item: RevertCacheType) =>
                item.branch === current && item.before['%H'] === commitIDs[len]
        )
        const _after = revertCache.findIndex(
            (item: RevertCacheType) =>
                item.branch === current && item.after['%H'] === commitIDs[len]
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
 * 清理撤销失败的记录
 * 1. 执行冲突导致失败，after = null
 * 2. 没有找到撤销记录
 * 3. 有撤销记录，但已经恢复
 *
 * @param all - 是否清理全部，默认只清理当前分支
 * @param opt - option: GitmBuildOption
 */
function calculate(all = false, opt: GitmBuildOption) {
    const keys = ['%H', '%T', '%P', '%aI', '%an', '%s', '%b']
    const revertCache = getRevertCache()
    const current = getCurrentBranch()
    let len = revertCache.length
    while (len--) {
        const { before, after, branch } = revertCache[len]
        let _undoLogs = [],
            _redoLogs = []
        if (!after) {
            // 没有after，尝试恢复
            const _logs = getGitLogs({
                lastet: opt.lastet,
                limit: opt.limit * 2,
                noMerges: true,
                keys,
                branch,
                grep: before['%H']
            })
            if (_logs && _logs.length > 0) revertCache[len].after = _logs[0]
        }
        _undoLogs = getGitLogs({
            lastet: '60d',
            limit: 500,
            noMerges: true,
            keys,
            branch,
            grep: before['%H']
        })
        if (after) {
            _redoLogs = getGitLogs({
                lastet: '60d',
                limit: 500,
                noMerges: true,
                keys,
                branch,
                grep: after['%H']
            })
        }
        // 不检测全部分支时，跳过非当前分支
        if (!all && current !== branch) continue
        // 没有找到该记录的撤销记录 或 撤销的记录被恢复过
        if (_undoLogs.length === 0 || _redoLogs.length > 0) {
            echo(
                yellow(
                    _undoLogs.length === 0
                        ? `检测到 ${revertCache[len].before['%H']} 这条记录撤销失败，已删除相关日志`
                        : `检测到 ${revertCache[len].before['%H']} 这条记录已经被恢复了，已删除相关日志`
                )
            )
            revertCache.splice(len, 1)
        }
    }
    setRevertCache(revertCache)
}

/**
 * gitm undo
 */
program
    .name('gitm undo')
    .usage(
        '[commitid...] [--lastet [lastet]] [--limit [limit]] [-m --mode [mode]] [--no-merges]'
    )
    .description(i18n.__('Undo a commit record'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .arguments('[commitid...]')
// .option('--calc', i18n.__('Clean up the current branch undo failure log'))
// .option('--calcAll', '清理所有撤销失败的记录')
// .option('--no-merges', '是否排除merge的日志')
// .option('-m, --mode [mode]', i18n.__('For undoing a merge record, the type to be passed in: 1 = keep current branch code, 2 = keep incoming code'), null)
// .option('--lastet [lastet]', i18n.__('Query logs after a certain time, fill in the format: 10s/2m/2h/3d/4M/5y'), '7d')
// .option('--limit [limit]', i18n.__('The maximum number of logs to be queried'), 20)
program.action(async (commitid: string[], opt: GitmBuildOption) => {
    const keys = ['%H', '%T', '%P', '%aI', '%an', '%s', '%b'] as const
    const current = getCurrentBranch()
    let logList: Array<
            {
                [key in typeof keys[number]]: string
            } & GitLogsType
        > = [],
        cmd: Array<CommandType | string> = [],
        commitIDs: string[] = [], // 需要执行的commitID
        mode = ''
    if (opt.calc) {
        calculate(false, opt)
        return
    }
    if (opt.calcAll) {
        calculate(true, opt)
        return
    }
    if (!opt.limit) opt.limit = 20
    mode = ' -m ' + Math.abs(Number(opt.mode || 1))
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
                message: i18n.__('Please select the commit record to undo.'),
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
        echo(yellow(i18n.__('No commit record selected, process has exited')))
        process.exit(0)
    }
    // 获取没有被undo过的记录
    commitIDs = getRevertCommitIDs(commitIDs)
    if (commitIDs.length === 0) {
        echo(yellow('没有可撤销的记录，进程已退出'))
        process.exit(0)
    }
    // 筛选被选择的记录
    logList = logList.filter(log =>
        commitIDs.some(id => log['%H'].includes(id))
    )
    cmd = logList.map(log => {
        // 判断是否有merge的记录
        // const isMergeLog = log['%P'].indexOf(' ') > -1
        return {
            cmd: `git revert -s --no-edit ${log['%H']}${mode}`,
            config: {
                again: false,
                success: `撤销成功：${log['%s']}`,
                fail: i18n.__(
                    'An error has occurred, please follow the instructions'
                )
            }
        }
    })
    // 先保存缓存
    const revertCacheList = logList.map(log => {
        const cache = { before: log, after: null, branch: current }
        const _logs = getGitLogs({
            lastet: opt.lastet,
            limit: opt.limit * 2,
            noMerges: true,
            keys,
            branch: current,
            grep: log['%H']
        })
        if (_logs.length > 0) cache.after = _logs[0]
        return cache
    })
    addRevertCache(revertCacheList)
    // 执行
    queue(cmd)
        .then(() => {
            calculate(false, opt)
        })
        .catch(() => {
            echo(
                yellow(
                    i18n.__(
                        'After handling conflicts, execute: gitm undo --calc'
                    )
                )
            )
        })
})

program.parse(process.argv)
export {}
