const { spawnSync } = require('../spawn')

/**
 * 获取git用户名称
 *
 * @returns user - 返回字符串
 */
function getGitUser(): string {
    const { stdout } = spawnSync('git', ['config', 'user.name'])
    return stdout
}

/**
 * 获取git用户邮箱
 *
 * @returns email - 返回字符串
 */
function getGitEmail(): string {
    const { stdout } = spawnSync('git', ['config', 'user.email'])
    return stdout
}

module.exports = {
    getGitUser,
    getGitEmail
}
export {}
