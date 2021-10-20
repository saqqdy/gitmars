const sh = require('shelljs')
const { getCurrent } = require('../index')

/**
 * 获取是否合并过dev
 *
 * @param branch - 待检测分支名
 * @param targetBranch - 目标分支
 * @returns isMergedDevBranch - 是否合并过
 */
function getIsMergedDevBranch(branch: string, targetBranch = 'dev'): boolean {
    if (!branch) branch = getCurrent()
    const result = sh
        .exec(`git branch --contains ${branch}`, { silent: true })
        .stdout.replace(/\s+$/g, '')
    return result.split('\n').includes(targetBranch)
}

module.exports = getIsMergedDevBranch
export {}
