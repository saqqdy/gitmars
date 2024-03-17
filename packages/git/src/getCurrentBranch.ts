import { spawnSync } from '@gitmars/core'

/**
 * 获取当前分支
 *
 * @returns {String} Return name
 */
function getCurrentBranch(): string {
	const { stdout } = spawnSync('git', ['symbolic-ref', '--short', '-q', 'HEAD'])
	return stdout || ''
}

export default getCurrentBranch
