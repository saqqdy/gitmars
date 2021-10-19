const { getCurrent, getLogs } = require('../index')

/**
 * 获取主干分支推送的内容是否是merge内容，暂时只检测最后一条记录
 *
 * @returns isMergedDevBranch - 是否merge
 */
export function getIsMergeAction(): boolean {
    const current = getCurrent()
    const currentLogs = getLogs({
        limit: 1,
        branches: current
    })
    const p = currentLogs[0]['%P'] ? currentLogs[0]['%P'].split(' ') : []
    return p.length > 1
}

export default getIsMergeAction
