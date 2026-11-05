import { debug, spawnSync } from '@gitmars/utils'
import getCurrentBranch from './getCurrentBranch'

/**
 * Check whether dev has been merged
 *
 * @param branch - Branch to check
 * @param targetBranch - Target branch
 * @param option - Options
 * @returns isMergedTargetBranch - Whether the target branch has been merged
 */
function getIsMergedTargetBranch(
	branch: string,
	targetBranch = 'dev',
	{
		remote = false,
		noMerges = true,
	}: {
		// Whether to query the remote, defaults to false
		remote?: boolean
		// Whether to exclude merge commits, defaults to true
		noMerges?: boolean
	},
): boolean {
	if (!branch) branch = getCurrentBranch() || ''
	if (remote && !targetBranch.includes('origin')) {
		targetBranch = `origin/${targetBranch}`
	}
	const { stdout } = spawnSync('git', [
		'log',
		noMerges ? '--no-merges' : '',
		'--format=%h',
		branch,
		`^${targetBranch}`,
		'--',
	])

	debug('getIsMergedTargetBranch', stdout)

	return !stdout || !/[a-zA-Z0-9]+/.test(stdout)
}

export default getIsMergedTargetBranch
