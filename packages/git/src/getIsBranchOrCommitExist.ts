import { spawnSync } from '@gitmars/utils'
import getCurrentBranch from './getCurrentBranch'

/**
 * Check whether a branch exists
 *
 * @param name - Branch name
 * @param remote - Whether to query the remote, defaults to false
 * @returns isBranchOrCommitExist - return true/false
 */
function getIsBranchOrCommitExist(name?: string | null, remote = false): boolean {
	if (!name) name = getCurrentBranch() || ''
	if (remote && !name.includes('origin')) name = `origin/${name}`
	const { status } = spawnSync('git', ['rev-parse', '--verify', name])

	return status === 0
}

export default getIsBranchOrCommitExist
