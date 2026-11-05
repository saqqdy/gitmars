import { debug, spawnSync } from '@gitmars/utils'

/**
 * Prune remote branches that have been deleted
 */
function prune(): void {
	debug('prune', 'prune remote success')
	spawnSync('git', ['remote', 'prune', 'origin'])
}

export default prune
