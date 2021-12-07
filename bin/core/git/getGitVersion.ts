const sh = require('shelljs')
const { spawnSync } = require('../spawn')
const { yellow } = require('colors')

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
    return version
}

module.exports = getGitVersion
export {}
