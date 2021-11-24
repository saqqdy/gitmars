const sh = require('shelljs')

/**
 * 获取git用户名称
 *
 * @returns user - 返回字符串
 */
function getGitUser(): string {
    return sh
        .exec('git config user.name', { silent: true })
        .stdout.replace(/(^\s+|\n*$)/g, '') // 去除首尾
}

/**
 * 获取git用户邮箱
 *
 * @returns email - 返回字符串
 */
function getGitEmail(): string {
    return sh
        .exec('git config user.email', { silent: true })
        .stdout.replace(/(^\s+|\n*$)/g, '') // 去除首尾
}

module.exports = {
    getGitUser,
    getGitEmail
}
export {}
