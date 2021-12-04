const sh = require('shelljs')
const getGitStatus = require('./getGitStatus')
const { warning, error } = require('../utils/colors')

/**
 * 检测状态，获取是否有未提交的文件
 *
 * @returns isOK - 返回true/false
 */
function checkGitStatus(): boolean {
    const sum = getGitStatus({ stdio: 'inherit' })
    if (sum.A.length > 0 || sum.D.length > 0 || sum.M.length > 0) {
        sh.echo(
            error('您还有未提交的文件，请处理后再继续') +
                '\n如果需要暂存文件请执行: gitm save\n恢复时执行：gitm get'
        )
        process.exit(1)
        return false
    } else if (sum['??'].length > 0) {
        sh.echo(
            warning('您有未加入版本的文件,') +
                '\n如果需要暂存文件请执行: gitm save --force\n恢复时执行：gitm get'
        )
    }
    return true
}

module.exports = checkGitStatus
export {}
