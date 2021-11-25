const sh = require('shelljs')

/**
 * 获取当前分支
 *
 * @returns {String} 返回名称
 */
function getCurrentBranch(): string {
    return sh
        .exec('git symbolic-ref --short -q HEAD', { silent: true })
        .stdout.replace(/[\n\s]*$/g, '')
}

module.exports = getCurrentBranch
export {}
