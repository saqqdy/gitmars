const sh = require('shelljs')
const { yellow } = require('colors')
const { spawnSync } = require('../spawn')
const { debug } = require('../utils/debug')

/**
 * 获取git版本
 *
 * @returns version - 返回版本号
 */
function getGitVersion(): string | void {
    const { stdout } = spawnSync('git', ['--version'])
    let version: string | string[] | null = stdout.match(/[\d.?]+/g) as string[]
    if (!version) {
        sh.echo(yellow('没有找到git'))
        process.exit(1)
        return
    }
    version = version[0]
    debug('getGitVersion', version)
    return version
}

module.exports = getGitVersion
export {}
