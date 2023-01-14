import type { SpawnOptions } from 'child_process'
import type { GitStatusInfoType } from '../../typings'
import { spawnSync } from '#lib/spawn'
import { debug } from '#lib/utils/debug'

/**
 * 获取分支状态
 *
 * @param config - spawn配置
 * @returns gitStatus - git状态
 */
function getGitStatus(config: SpawnOptions = {}): GitStatusInfoType {
	const { stdout } = spawnSync('git', ['status', '-s', '--no-column'], config)
	const list = stdout ? stdout.replace(/\n(\s+)/g, '\n').split('\n') : []
	const sum: GitStatusInfoType = {
		A: [],
		D: [],
		M: [],
		UU: [],
		'??': []
	}
	if (list.length === 0) return sum
	list.forEach((str: string) => {
		const arr: string[] = str.trim().replace(/\s+/g, ' ').split(' ')
		const type = arr.splice(0, 1)[0] as keyof GitStatusInfoType
		if (!sum[type]) sum[type] = []
		sum[type].push(arr.join(' '))
	})
	debug('getGitStatus', sum)
	return sum
}

export default getGitStatus
