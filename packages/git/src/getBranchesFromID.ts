import { debug, spawnSync } from '@gitmars/utils'

/**
 * Get branches containing a commit ID
 *
 * @param commitID - commitID
 * @param remote - Whether to check the remote
 * @returns branches - The list of branches
 */
function getBranchesFromID(commitID: string, remote = false): string[] {
	const { stdout } = spawnSync('git', [
		'branch',
		remote ? '-r' : '',
		'--contains',
		commitID,
		'--format',
		'%(refname:short)',
	])

	debug('getBranchesFromID', stdout)

	return stdout ? stdout.split('\n') : []
}

export default getBranchesFromID
