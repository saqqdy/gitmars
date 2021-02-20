const hookComment = require('./getHookComment')()

/**
 * getLocalShell
 * @description 获取本地脚本
 * @returns {Object} arr 返回对象
 */

function getLocalShell(pmName, relativeUserPkgDir) {
    return `${hookComment}

packageManager=${pmName}
cd "${relativeUserPkgDir}"
`
}

module.exports = getLocalShell
