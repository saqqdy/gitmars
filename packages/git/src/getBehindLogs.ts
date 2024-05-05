import { debug, spawnSync } from '@gitmars/utils'
import fetch from './fetch'
import getCurrentBranch from './getCurrentBranch'

/**
 * 获取当前本地分支落后远程的日志
 *
 * @param branch - 待检测分支名
 * @param targetBranch - 目标分支
 * @returns behindLogs - 是否
 */
function getBehindLogs(): string[] {
	const current = getCurrentBranch()
	fetch()
	const { stdout } = spawnSync('git', [
		'log',
		`${current}..origin/${current}`,
		'--pretty',
		'format:%p'
	])
	debug('getBehindLogs', stdout)
	return stdout ? stdout.split('\n') : []
}

export default getBehindLogs
