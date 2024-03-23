import { spawnSync } from '@gitmars/utils'
import { debug } from '@gitmars/utils'

/**
 * 获取当前是否git项目目录
 *
 * @returns isGitProject - 返回是否git项目目录
 */
function getIsGitProject(): boolean {
	const { stdout } = spawnSync('git', ['rev-parse', '--is-inside-work-tree'])
	debug('getIsGitProject', stdout, stdout!.includes('true'))
	return stdout!.includes('true')
}

export default getIsGitProject
