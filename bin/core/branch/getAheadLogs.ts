const sh = require('shelljs')
const { getCurrentBranch } = require('../git/index')

/**
 * 获取当前本地分支领先远程的日志
 *
 * @returns aheadLogs - 日志
 */
function getAheadLogs(): string[] {
    const current = getCurrentBranch()
    sh.exec('git fetch', { silent: true })
    const result = sh
        .exec(`git log origin/${current}..${current} --pretty=format:"%p"`, {
            silent: true
        })
        .stdout.replace(/\s+$/g, '')
    return result ? result.split('\n') : []
}

module.exports = getAheadLogs
export {}
