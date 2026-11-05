import { debug, spawnSync } from '@gitmars/utils'

/**
 * Check whether the current directory is a git repository
 *
 * @returns isGitProject - Whether the current directory is a git repository
 */
function getIsGitProject(): boolean {
	const { stdout } = spawnSync('git', ['rev-parse', '--is-inside-work-tree'])

	debug('getIsGitProject', stdout, stdout!.includes('true'))

	return stdout!.includes('true')
}

export default getIsGitProject
