const sh = require('shelljs')

/**
 * 获取当前是否git项目目录
 *
 * @returns isGitProject - 返回是否git项目目录
 */
function getIsGitProject(): boolean {
    return sh
        .exec('git rev-parse --is-inside-work-tree', { silent: true })
        .stdout.includes('true')
}

module.exports = getIsGitProject
