import { spawnSync } from '../spawn'
import { debug } from '../utils/debug'
import getCurrentBranch from './getCurrentBranch'

/**
 * 获取当前本地分支领先远程的日志
 *
 * @returns aheadLogs - 日志
 */
export function getAheadLogs(): string[] {
    const current = getCurrentBranch()
    spawnSync('git', ['fetch'])
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
