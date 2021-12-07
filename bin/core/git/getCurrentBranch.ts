const { spawnSync } = require('../spawn')

/**
 * 获取当前分支
 *
 * @returns {String} 返回名称
 */
function getCurrentBranch(): string {
    const { stdout } = spawnSync('git', [
        'symbolic-ref',
        '--short',
        '-q',
        'HEAD'
    ])
    return stdout
}

module.exports = getCurrentBranch
export {}
