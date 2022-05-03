import { spawnSync } from '../spawn'
import { debug } from '../utils/debug'

/**
 * 获取当前是否git项目目录
 *
 * @returns isGitProject - 返回是否git项目目录
 */
export function getIsGitProject(): boolean {
    const { stdout } = spawnSync('git', ['rev-parse', '--is-inside-work-tree'])
    debug('getIsGitProject', stdout, stdout!.includes('true'))
    return stdout!.includes('true')
}

export default getIsGitProject
