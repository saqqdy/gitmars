import getGitLogs from '#lib/git/getGitLogs'

/**
 * 获取主干分支推送的内容是否是merge内容，暂时只检测最后一条记录
 *
 * @returns isMergeAction - 是否merge
 */
function getIsMergeAction(): boolean {
	const currentLogs = getGitLogs({
		limit: 1
	})
	const p = currentLogs[0]['%P'] ? currentLogs[0]['%P'].split(' ') : []
	return p.length > 1
}

export default getIsMergeAction
