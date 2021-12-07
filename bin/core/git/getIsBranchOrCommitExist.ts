const { spawnSync } = require('../spawn')
const getCurrentBranch = require('./getCurrentBranch')

/**
 * 获取是否存在某个分支
 *
 * @param name - 分支名称
 * @param remote - 是否查询远程，默认：false
 * @returns isBranchOrCommitExist - 返回true/false
 */
function getIsBranchOrCommitExist(name: string, remote = false): boolean {
    if (!name) name = getCurrentBranch()
    if (remote && name.indexOf('origin') === -1) name = 'origin/' + name
    const { status } = spawnSync('git', ['rev-parse', '--verify', name])
    return status === 0
}

module.exports = getIsBranchOrCommitExist
export {}
