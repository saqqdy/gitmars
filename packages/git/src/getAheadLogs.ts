import { debug, spawnSync } from '@gitmars/utils'
import fetch from './fetch'
import getCurrentBranch from './getCurrentBranch'

/**
 * Get commits the local branch is ahead of the remote
 *
 * @returns aheadLogs - The list of commits
 */
function getAheadLogs(): string[] {
	const current = getCurrentBranch()

	fetch()
	const { stdout } = spawnSync('git', [
		'log',
		`origin/${current}..${current}`,
		'--pretty',
		'format:%p',
	])

	debug('getAheadLogs', stdout)

	return stdout ? stdout.split('\n') : []
}

export default getAheadLogs
