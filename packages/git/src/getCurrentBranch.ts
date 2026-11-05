import { spawnSync } from '@gitmars/utils'

/**
 * Get the current branch
 *
 * @returns - Return name
 */
function getCurrentBranch(): string {
	const { stdout } = spawnSync('git', ['symbolic-ref', '--short', '-q', 'HEAD'])

	return stdout || ''
}

export default getCurrentBranch
