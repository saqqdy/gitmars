import { spawnSync } from '#lib/spawn'
import { debug } from '#lib/utils/debug'

/**
 * 同步远程版本
 */
function fetch(): void {
	debug('fetch', 'fetch success')
	spawnSync('git', ['fetch'])
}

export default fetch
