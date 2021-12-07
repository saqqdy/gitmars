const { spawnSync } = require('../spawn')
const getCurrentBranch = require('./getCurrentBranch')

/**
 * 获取当前本地分支领先远程的日志
 *
 * @returns aheadLogs - 日志
 */
function getAheadLogs(): string[] {
    const current = getCurrentBranch()
    spawnSync('git', ['fetch'])
    const { stdout } = spawnSync('git', [
        'log',
        `origin/${current}..${current}`,
        '--pretty',
        'format:%p'
    ])
    return stdout ? stdout.split('\n') : []
}

module.exports = getAheadLogs
export {}
