import { debug, getSeconds, spawnSync } from '@gitmars/utils'
import GitLogsFormatter from './gitLogsFormatter'
import type { GitLogKeysType, GitLogsType } from './types'

export interface GetGitLogsOption {
	// 限制显示最近多长时间的日志
	lastet?: string
	// 限制数量
	limit?: number
	// Attached parameters
	params?: string
	// Fields to be returned
	keys?: GitLogKeysType[]
	// 是否排除merge记录
	noMerges?: boolean
	// 筛选关键词
	grep?: string
	// 筛选提交人
	author?: string
	// 要查询的分支
	branch?: string
}

/**
 * 获取日志
 *
 * @param option - Parameters
 * @returns logsList - Return array
 */
function getGitLogs(option: GetGitLogsOption = {}): GitLogsType[] {
	const { lastet, limit, params = '', keys = [], noMerges = false, grep, author, branch } = option
	const formatter = new GitLogsFormatter()
	let argv = ['log', branch || '', '--date-order', `--pretty=format:${formatter.getFormat(keys)}`]
	if (limit) argv.push('-' + limit)
	if (lastet) argv = argv.concat(['--since', String(getSeconds(lastet) || '')])
	if (grep) argv = argv.concat(['--grep', grep])
	if (author) argv = argv.concat(['--author', author])
	if (noMerges) argv.push('--no-merges')
	if (params) argv = argv.concat(params.split(' '))
	const { stdout } = spawnSync('git', argv)
	debug('getGitLogs', stdout)
	return formatter.getLogs(stdout!)
}

export default getGitLogs
