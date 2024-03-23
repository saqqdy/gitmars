import { debug, getSeconds, spawnSync } from '@gitmars/utils'
import GitLogsFormatter from './gitLogsFormatter'
import type { GitLogKeysType, GitLogsType } from './types'

export interface GetGitLogsOption {
	lastet?: string
	limit?: number
	params?: string
	keys?: GitLogKeysType[]
	noMerges?: boolean
	grep?: string
	author?: string
	branch?: string
}

/**
 * 获取日志
 *
 * @param option - Parameters
 * @param option.lastet - 限制显示最近多长时间的日志
 * @param option.limit - 限制数量
 * @param option.noMerges - 是否排除merge记录
 * @param option.params - Attached parameters
 * @param option.keys - Fields to be returned
 * @param option.grep - 筛选关键词
 * @param option.author - 筛选提交人
 * @param option.branch - 要查询的分支
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
