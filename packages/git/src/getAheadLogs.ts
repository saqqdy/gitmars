import { debug, spawnSync } from '@gitmars/utils'
import fetch from './fetch'
import getCurrentBranch from './getCurrentBranch'

/**
 * 获取当前本地分支领先远程的日志
 *
 * @returns aheadLogs - 日志
 */
function getAheadLogs(): string[] {
	const current = getCurrentBranch()
	fetch()
	const { stdout } = spawnSync('git', [
		'log',
		`origin/${current}..${current}`,
		'--pretty',
		'format:%p'
	])
	debug('getAheadLogs', stdout)
	return stdout ? stdout.split('\n') : []
}

export default getAheadLogs
