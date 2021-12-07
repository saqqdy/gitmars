const { spawnSync } = require('../spawn')

/**
 * 获取当前是否git项目目录
 *
 * @returns isGitProject - 返回是否git项目目录
 */
function getIsGitProject(): boolean {
    const { stdout } = spawnSync('git', ['rev-parse', '--is-inside-work-tree'])
    return stdout.includes('true')
}

module.exports = getIsGitProject
export {}
