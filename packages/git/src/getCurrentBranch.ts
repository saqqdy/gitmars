import { spawnSync } from '@gitmars/utils'

/**
 * 获取当前分支
 *
 * @returns - Return name
 */
function getCurrentBranch(): string {
	const { stdout } = spawnSync('git', ['symbolic-ref', '--short', '-q', 'HEAD'])
	return stdout || ''
}

export default getCurrentBranch
