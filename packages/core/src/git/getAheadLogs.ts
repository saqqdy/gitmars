import { spawnSync } from '#lib/spawn'
import { debug } from '#lib/utils/debug'
import fetch from '#lib/git/fetch'
import getCurrentBranch from '#lib/git/getCurrentBranch'

/**
 * 获取当前本地分支领先远程的日志
 *
 * @returns aheadLogs - 日志
 */
function getAheadLogs(): string[] {
    const current = getCurrentBranch()
    fetch()
    const { stdout } = spawnSync('git', [
        'log',
        `origin/${current}..${current}`,
        '--pretty',
        'format:%p'
    ])
    debug('getAheadLogs', stdout)
    return stdout ? stdout.split('\n') : []
}

export default getAheadLogs
