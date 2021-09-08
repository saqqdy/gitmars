const sh = require('shelljs')
const { warning } = require('./index')

/**
 * getGitVersion
 * @description 获取git版本
 * @returns {String} str 返回版本号
 */
function getGitVersion(): string | void {
    let version: any = sh
        .exec('git --version', { silent: true })
        .stdout.replace(/\s*$/g, '')
        .match(/[\d.?]+/g) as string[]
    if (!version) {
        sh.echo(warning('没有找到git'))
        sh.exit(1)
        return
    }
    version = version[0]
    return version
}

module.exports = getGitVersion
