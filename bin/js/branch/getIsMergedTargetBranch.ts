const sh = require('shelljs')
const { getCurrent } = require('../index')

/**
 * 获取是否合并过dev
 *
 * @param branch - 待检测分支名
 * @param targetBranch - 目标分支
 * @param remote - 是否查询远程，默认：false
 * @returns isMergedTargetBranch - 是否合并过
 */
function getIsMergedTargetBranch(
    branch: string,
    targetBranch = 'dev',
    remote: boolean = false
): boolean {
    if (!branch) branch = getCurrent()
    if (remote && targetBranch.indexOf('origin') === -1)
        targetBranch = 'origin/' + targetBranch
    const result = sh
        .exec(
            `git branch --contains ${branch} --format="%(refname:short)" ${
                remote ? '--remote' : ''
            }`,
            {
                silent: true
            }
        )
        .stdout.replace(/\s+$/g, '')
    return result.split('\n').includes(targetBranch)
}

module.exports = getIsMergedTargetBranch
export {}
