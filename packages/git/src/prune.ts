import { spawnSync } from '@gitmars/utils'
import { debug } from '@gitmars/utils'

/**
 * 清理已删除的远程分支
 */
function prune(): void {
	debug('prune', 'prune remote success')
	spawnSync('git', ['remote', 'prune', 'origin'])
}

export default prune
