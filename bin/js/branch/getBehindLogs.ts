const sh = require('shelljs')
const { getCurrent } = require('../index')

/**
 * 获取当前本地分支落后远程的日志
 *
 * @param branch - 待检测分支名
 * @param targetBranch - 目标分支
 * @returns behindLogs - 是否
 */
function getBehindLogs(): string[] {
    const current = getCurrent()
    sh.exec('git fetch', { silent: true })
    const result = sh
        .exec(`git log ${current}..origin/${current} --pretty=format:"%p"`, {
            silent: true
        })
        .stdout.replace(/\s+$/g, '')
    return result ? result.split('\n') : []
}

module.exports = getBehindLogs
export {}
