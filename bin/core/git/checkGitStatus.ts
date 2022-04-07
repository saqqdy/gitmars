const sh = require('shelljs')
const { yellow, red } = require('colors')
const { debug } = require('../utils/debug')
const getGitStatus = require('./getGitStatus')

/**
 * 检测状态，获取是否有未提交的文件
 *
 * @returns isOK - 返回true/false
 */
function checkGitStatus(): boolean {
    const sum = getGitStatus({ stdio: 'inherit' })
    debug('checkGitStatus', sum)
    if (
        sum.A.length > 0 ||
        sum.D.length > 0 ||
        sum.M.length > 0 ||
        sum.UU.length > 0
    ) {
        sh.echo(
            red('您还有未提交的文件，请处理后再继续') +
                '\n如果需要暂存文件请执行: gitm save\n恢复时执行：gitm get'
        )
        process.exit(1)
        return false
    } else if (sum['??'].length > 0) {
        sh.echo(
            yellow('您有未加入版本的文件,') +
                '\n如果需要暂存文件请执行: gitm save --force\n恢复时执行：gitm get'
        )
    }
    return true
}

module.exports = checkGitStatus
export {}
