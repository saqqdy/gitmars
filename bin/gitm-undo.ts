#!/usr/bin/env ts-node
const { program } = require('commander')
const dayjs = require('dayjs')
const inquirer = require('inquirer')
const sh = require('shelljs')
const { options, args } = require('./conf/undo')
const { queue } = require('./core/queue')
const { getIsGitProject, getGitLogs } = require('./core/git/index')
const { getRevertCache, addRevertCache } = require('./core/cache/index')
const { error, warning } = require('./core/utils/index')
const { createArgs, echo } = require('./core/utils/index')
const { spawnSync } = require('./core/spawn')
const GitLogsFormatter = require('./core/git/gitLogsFormatter')
if (!getIsGitProject()) {
    sh.echo(error('当前目录不是git项目目录'))
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
    mode?: 1 | 2
    merges?: boolean
    lastet?: string
    limit?: number
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
        const _index = revertCache.findIndex(
            (item: RevertCacheType) => item.before['%H'] === commitIDs[len]
        )
        if (_index > -1) {
            echo(
                warning(
                    `检测到 ${commitIDs[len]} 这条记录撤销过一次，请检查是否有误！`
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
    const formatter = new GitLogsFormatter()
    const keys = ['%H', '%T', '%P', '%aI', '%an', '%s', '%b'] as const
    let logList: Array<
            {
                [key in typeof keys[number]]: string
            } & GitLogsType
        > = [],
        cmd: Array<CommandType | string> = [],
        commitIDs: string[] = [],
        mode = ''
    if (opt.mode) mode = ' -m ' + Math.abs(Number(opt.mode))
    if (commitid.length > 0) {
        // 传入了commitIDs
        const { stdout } = spawnSync('git', [
            'show',
            ...commitid,
            '--name-only',
            `--pretty=format:${formatter.getFormat(keys)}`
        ])
        logList = formatter.getLogs(stdout)
    } else {
        // 没有传入commitIDs，展示日志列表给用户选择
        logList = getGitLogs({
            lastet: opt.lastet,
            limit: opt.limit,
            noMerges: !opt.merges,
            keys
        })
        logList.reverse()
    }
    // 多条记录，提示选择要恢复的记录
    if (logList.length > 1) {
        const prompt: InitInquirerPromptType = {
            type: 'checkbox',
            message: '请选择要撤销的commit记录',
            name: 'commitIDs',
            choices: []
        }
        logList.forEach(log => {
            const _time = dayjs(log['%aI']).format('YYYY-MM-DD HH:mm:ss')
            prompt.choices.push({
                name: `${log['%an']}操作于：${_time}`,
                value: log['%H'],
                checked: false
            })
        })
        commitIDs = (await inquirer.prompt(prompt)).commitIDs
    }
    if (commitIDs.length === 0) {
        echo(warning('没有选择任务记录，进程已退出'))
        process.exit(0)
    }
    // 获取没有被undo过的记录
    commitIDs = getRevertCommitIDs(commitIDs)
    if (commitIDs.length === 0) {
        echo(warning('没有可撤销的记录，进程已退出'))
        process.exit(0)
    }
    // 筛选被选择的记录
    logList = logList.filter(log => commitIDs.includes(log['%H']))
    cmd = logList.map(log => ({
        cmd: `git revert ${log['%H']}${mode}`,
        config: {
            again: true,
            success: '撤销成功',
            fail: '出错了，请根据提示处理'
        }
    }))
    queue(cmd).then(() => {
        addRevertCache(logList)
    })
})

program.parse(process.argv)
export {}
