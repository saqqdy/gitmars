import { spawnSync } from '../spawn'
import getCurrentBranch from './getCurrentBranch'

/**
 * 获取是否存在某个分支
 *
 * @param name - 分支名称
 * @param remote - 是否查询远程，默认：false
 * @returns isBranchOrCommitExist - 返回true/false
 */
export function getIsBranchOrCommitExist(
    name: string,
    remote = false
): boolean {
    if (!name) name = getCurrentBranch()
    if (remote && !name.includes('origin')) name = 'origin/' + name
    const { status } = spawnSync('git', ['rev-parse', '--verify', name])
    return status === 0
}

export default getIsBranchOrCommitExist
