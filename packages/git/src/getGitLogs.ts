import type { GitLogKeysType, GitLogsType } from './types'
import { debug, getSeconds, spawnSync } from '@gitmars/utils'
import GitLogsFormatter from './gitLogsFormatter'

export interface GetGitLogsOption {
	// Limit logs to a recent time window
	lastet?: string
	// Maximum number of entries
	limit?: number
	// Attached parameters
	params?: string
	// Fields to be returned
	keys?: GitLogKeysType[]
	// Whether to exclude merge commits
	noMerges?: boolean
	// Filter by keyword
	grep?: string
	// Filter by author
	author?: string
	// Branch to query
	branch?: string
}

/**
 * Get logs
 *
 * @param option - Parameters
 * @returns logsList - Return array
 */
function getGitLogs(option: GetGitLogsOption = {}): GitLogsType[] {
	const { lastet, limit, params = '', keys = [], noMerges = false, grep, author, branch } = option
	const formatter = new GitLogsFormatter()
	let argv = ['log', branch || '', '--date-order', `--pretty=format:${formatter.getFormat(keys)}`]

	if (limit) argv.push(`-${limit}`)
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
