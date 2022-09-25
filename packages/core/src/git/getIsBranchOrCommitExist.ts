import { spawnSync } from '#lib/spawn'
import getCurrentBranch from '#lib/git/getCurrentBranch'

/**
 * 获取是否存在某个分支
 *
 * @param name - 分支名称
 * @param remote - 是否查询远程，默认：false
 * @returns isBranchOrCommitExist - return true/false
 */
function getIsBranchOrCommitExist(
    name?: string | null,
    remote = false
): boolean {
    if (!name) name = getCurrentBranch() || ''
    if (remote && !name.includes('origin')) name = 'origin/' + name
    const { status } = spawnSync('git', ['rev-parse', '--verify', name])
    return status === 0
}

export default getIsBranchOrCommitExist
