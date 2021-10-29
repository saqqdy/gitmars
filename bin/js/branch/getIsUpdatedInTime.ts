const { getCurrent, getLogs } = require('../index')

import type { GitLogType } from '../../../typings'

export interface IsUpdatedInTimeConfigType {
    lastet: string
    limit: string | number
    branch: string
}

/**
 * 获取一周内是否同步过上游分支代码
 *
 * @param option - 参数
 * @param option.lastet - 最近几天的日志，可以是10s/2m/2h/3d/4M/5y
 * @param option.limit - 日志数量限制
 * @param option.branch - 目标分支
 * @returns isMergedDevBranch - 是否合并过
 */
function getIsUpdatedInTime({
    lastet,
    limit,
    branch: branches
}: IsUpdatedInTimeConfigType): boolean {
    let isUpdated = false
    const current = getCurrent()
    const mainVers: string[] = []
    const currentVers: string[] = []
    const mainLogs = getLogs({
        lastet,
        limit,
        branches,
        params: '--no-merges'
    })
    const currentLogs = getLogs({
        lastet,
        limit,
        branches: current,
        params: '--no-merges'
    })
    mainLogs.forEach((log: GitLogType) => {
        mainVers.push(log['%H'])
    })
    currentLogs.forEach((log: GitLogType) => {
        const arr = log['%P'] ? log['%P'].split(' ') : []
        arr.forEach((item: string) => {
            currentVers.push(item)
        })
    })
    mainVer: for (const ver of mainVers) {
        if (currentVers.includes(ver)) {
            isUpdated = true
            break mainVer
        }
    }
    return isUpdated
}

module.exports = getIsUpdatedInTime
export {}
