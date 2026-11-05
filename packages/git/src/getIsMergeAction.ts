import getGitLogs from './getGitLogs'

/**
 * Check whether the pushed content on the trunk branch is a merge; only the latest commit is checked for now
 *
 * @returns isMergeAction - Whether the push is a merge
 */
function getIsMergeAction(): boolean {
	const currentLogs = getGitLogs({
		limit: 1,
	})
	const p = currentLogs[0]['%P'] ? currentLogs[0]['%P'].split(' ') : []

	return p.length > 1
}

export default getIsMergeAction
