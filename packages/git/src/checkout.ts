import { debug, spawnSync } from '@gitmars/utils'

/**
 * Switch to branch
 */
export default function checkout(branch: string): void {
	debug('switch', 'switch success')
	spawnSync('git', ['switch', branch])
}
