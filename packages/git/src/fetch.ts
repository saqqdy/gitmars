import { debug, spawnSync } from '@gitmars/utils'

/**
 * Fetch from the remote
 */
function fetch(): void {
	debug('fetch', 'fetch success')
	spawnSync('git', ['fetch'])
}

export default fetch
