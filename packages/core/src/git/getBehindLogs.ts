import { spawnSync } from '../spawn'
import { debug } from '../utils/debug'
import getCurrentBranch from './getCurrentBranch'

/**
 * 获取当前本地分支落后远程的日志
 *
 * @param branch - 待检测分支名
 * @param targetBranch - 目标分支
 * @returns behindLogs - 是否
 */
export function getBehindLogs(): string[] {
    const current = getCurrentBranch()
    spawnSync('git', ['fetch'])
    const { stdout } = spawnSync('git', [
        'log',
        `${current}..origin/${current}`,
        '--pretty',
        'format:%p'
    ])
    debug('getBehindLogs', stdout)
    return stdout ? stdout.split('\n') : []
}

export default getBehindLogs
