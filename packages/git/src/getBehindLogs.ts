import { debug, spawnSync } from '@gitmars/utils'
import fetch from './fetch'
import getCurrentBranch from './getCurrentBranch'

/**
 * Get commits the local branch is behind the remote
 *
 * @returns behindLogs - Commits the local branch is behind by
 */
function getBehindLogs(): string[] {
	const current = getCurrentBranch()

	fetch()
	const { stdout } = spawnSync('git', [
		'log',
		`${current}..origin/${current}`,
		'--pretty',
		'format:%p',
	])

	debug('getBehindLogs', stdout)

	return stdout ? stdout.split('\n') : []
}

export default getBehindLogs
