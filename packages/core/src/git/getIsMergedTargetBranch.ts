import { spawnSync } from '../spawn'
import { debug } from '../utils/debug'
import getCurrentBranch from './getCurrentBranch'

/**
 * 获取是否合并过dev
 *
 * @param branch - 待检测分支名
 * @param targetBranch - 目标分支
 * @param remote - 是否查询远程，默认：false
 * @returns isMergedTargetBranch - 是否合并过
 */
export function getIsMergedTargetBranch(
    branch: string,
    targetBranch = 'dev',
    remote = false
): boolean {
    if (!branch) branch = getCurrentBranch()
    if (remote && !targetBranch.includes('origin')) {
        targetBranch = 'origin/' + targetBranch
    }
    const { stdout } = spawnSync('git', [
        'branch',
        '--contains',
        branch,
        '--format',
        '%(refname:short)',
        remote ? '--remote' : ''
    ])
    debug('getIsMergedTargetBranch', stdout)
    return stdout.split('\n').includes(targetBranch)
}

export default getIsMergedTargetBranch
