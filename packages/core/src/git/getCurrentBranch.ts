import { spawnSync } from '../spawn'

/**
 * 获取当前分支
 *
 * @returns {String} 返回名称
 */
export function getCurrentBranch(): string {
    const { stdout } = spawnSync('git', [
        'symbolic-ref',
        '--short',
        '-q',
        'HEAD'
    ])
    return stdout || ''
}

export default getCurrentBranch
