import { spawnSync } from '@gitmars/core'
import { debug } from '@gitmars/utils'
import getCurrentBranch from './getCurrentBranch'

/**
 * 获取是否合并过dev
 *
 * @param branch - 待检测分支名
 * @param targetBranch - 目标分支
 * @param option - 参数
 * @param option.remote - 是否查询远程，默认：false
 * @param option.noMerges - 是否排除merges类型，默认：true
 * @returns isMergedTargetBranch - 是否合并过
 */
function getIsMergedTargetBranch(
	branch: string,
	targetBranch = 'dev',
	{
		remote = false,
		noMerges = true
	}: {
		remote?: boolean
		noMerges?: boolean
	}
): boolean {
	if (!branch) branch = getCurrentBranch() || ''
	if (remote && !targetBranch.includes('origin')) {
		targetBranch = 'origin/' + targetBranch
	}
	const { stdout } = spawnSync('git', [
		'log',
		noMerges ? '--no-merges' : '',
		'--format=%h',
		branch,
		`^${targetBranch}`,
		'--'
	])
	debug('getIsMergedTargetBranch', stdout)
	return !stdout || !/[a-zA-Z0-9]+/.test(stdout)
}

export default getIsMergedTargetBranch
