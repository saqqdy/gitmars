import { spawnSync } from '#lib/spawn'
import { debug } from '#lib/utils/debug'

/**
 * 清理已删除的远程分支
 */
function prune(): void {
	debug('prune', 'prune remote success')
	spawnSync('git', ['remote', 'prune', 'origin'])
}

export default prune
