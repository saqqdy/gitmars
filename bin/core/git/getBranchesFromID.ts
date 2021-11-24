const sh = require('shelljs')

/**
 * 获取包含commitID的分支
 *
 * @param commitID - commitID
 * @param remote - 是否检测远程
 * @returns branches - 返回分支列表
 */
function getBranchesFromID(commitID: string, remote = false): string[] {
    const out = sh
        .exec(
            `git branch ${
                remote ? '-r' : ''
            } --contains ${commitID} --format="%(refname:short)`,
            { silent: true }
        )
        .stdout.replace(/(^\s+|\n*$)/g, '') // 去除首尾
    return out ? out.split('\n') : []
}

module.exports = getBranchesFromID
export {}
