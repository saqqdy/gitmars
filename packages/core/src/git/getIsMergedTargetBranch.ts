import { spawnSync } from '#lib/spawn'
import { debug } from '#lib/utils/debug'
import getCurrentBranch from '#lib/git/getCurrentBranch'

/**
 * 获取是否合并过dev
 *
 * @param branch - 待检测分支名
 * @param targetBranch - 目标分支
 * @param option - 参数
 * @param option.remote - 是否查询远程，默认：false，非strictly模式下此参数无效
 * @param option.strictly - 是否严格模式，默认：true
 * @returns isMergedTargetBranch - 是否合并过
 */
function getIsMergedTargetBranch(
    branch: string,
    targetBranch = 'dev',
    {
        remote = false,
        strictly = true
    }: {
        remote?: boolean
        strictly?: boolean
    }
): boolean {
    if (!branch) branch = getCurrentBranch() || ''
    if (remote && !targetBranch.includes('origin')) {
        targetBranch = 'origin/' + targetBranch
    }

    if (strictly) {
        const { stdout } = spawnSync('git', [
            'branch',
            '--contains',
            branch,
            '--format=%(refname:short)',
            remote ? '--remote' : ''
        ])
        debug('getIsMergedTargetBranch:strictly', stdout)
        return !stdout || stdout.split('\n').includes(targetBranch)
    }
    const { stdout } = spawnSync('git', [
        'log',
        branch,
        `^${targetBranch}`,
        '--no-merges',
        '--format=%h'
    ])
    debug('getIsMergedTargetBranch', stdout)
    return !stdout || !/[a-zA-Z0-9]+/.test(stdout)
}

export default getIsMergedTargetBranch
