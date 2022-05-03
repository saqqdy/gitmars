import sh from 'shelljs'
import { yellow } from 'colors'
import { spawnSync } from '../spawn'
import { debug } from '../utils/debug'

/**
 * 获取git版本
 *
 * @returns version - 返回版本号
 */
export function getGitVersion(): string | void {
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

export default getGitVersion
