import { spawnSync } from '#lib/spawn'
import { debug } from '#lib/utils/debug'
import fetch from '#lib/git/fetch'
import getCurrentBranch from '#lib/git/getCurrentBranch'

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
