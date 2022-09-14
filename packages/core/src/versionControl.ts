import { createRequire } from 'node:module'
import sh from 'shelljs'
import chalk from 'chalk'
// import { version } from '../package.json' assert { type: 'json' }
import { getPkgInfo } from '#lib/utils/pkgInfo'
import { debug } from '#lib/utils/debug'
import i18n from '#lib/locales/index'

const require = createRequire(import.meta.url)
const { version } = require('../package.json')

/**
 * 判断是否需要升级版本
 *
 * @returns isNeedUpgrade 返回是/否
 */
export async function isNeedUpgrade(): Promise<boolean> {
    const { 'dist-tags': tags, versions } = await getPkgInfo()
    debug('tags-versions', tags, versions)
    // let compareVers = []
    // if (version.indexOf('1.') === 0) {
    //     // compareVers = versions.filter(
    //     //     (item: string) => /^1\./.test(item) && !item.match(/[a-z]+/g)
    //     // )
    //     // // 有落后middle以上的版本需要更新版本
    //     // for (let ver of versions) {
    //     //     if (/^1\./.test(ver) && parseFloat(ver) > parseFloat(ver)) {
    //     //         return true
    //     //     }
    //     // }
    //     // return false
    //     return parseFloat(tags.lite) > parseFloat(version)
    // }
    return parseFloat(tags.latest) > parseFloat(version)
}

/**
 * 升级版本提示
 */
export function upgradeGitmars() {
    sh.echo(
        chalk.red(
            i18n.__(
                'Your version is detected as old, please upgrade before using'
            )
        ) +
            chalk.green(
                i18n.__(
                    '\nMac users upgrade method: sudo gitm upgrade latest -m -c npm \nWindows users use PowerShell or CMD: gitm upgrade latest -m -c npm.cmd'
                )
            )
    )
    process.exit(1)
}

export default {
    isNeedUpgrade,
    upgradeGitmars
}
