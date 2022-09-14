import sh from 'shelljs'
import chalk from 'chalk'
import { debug } from '#lib/utils/debug'
import getGitStatus from '#lib/git/getGitStatus'
import i18n from '#lib/locales/index'

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
            chalk.red(
                i18n.__(
                    'You still have uncommitted files, please process them before continuing'
                )
            ) +
                '\n' +
                i18n.__(
                    'If you need to staging files please do: gitm save\nWhen resuming: gitm get'
                )
        )
        process.exit(1)
        return false
    } else if (sum['??'].length > 0) {
        sh.echo(
            chalk.yellow(i18n.__('You have uncommitted files')) +
                ',\n' +
                i18n.__(
                    'If you need to staging files please run: gitm save --force\nWhen resuming: gitm get'
                )
        )
    }
    return true
}

export default checkGitStatus
