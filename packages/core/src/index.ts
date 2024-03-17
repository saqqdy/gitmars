export { default as getUserInfo } from '#lib/api/getUserInfo'
export {
	acceptMergeRequest,
	createMergeRequest,
	deleteMergeRequest,
	getMergeRequestChanges,
	getMergeRequestCloseIssues,
	getMergeRequestCommits,
	getMergeRequestDiffVersions,
	getMergeRequestList,
	getMergeRequestParticipants,
	updateMergeRequest
} from '#lib/api/mergeRequest'

export { default as runJenkins } from '#lib/build/runJenkins'
export { cleanBuildConfig, getBuildConfig } from '#lib/build/buildConfig'

export { cleanCache, isCacheExpired, updateCacheTime } from '#lib/cache/cache'
export { cleanLog, setLog } from '#lib/cache/log'
export { cleanCommandCache, getCommandCache, setCommandCache } from '#lib/cache/commandCache'
export {
	addRevertCache,
	cleanRevertCache,
	delRevertCache,
	getRevertCache,
	setRevertCache
} from '#lib/cache/revertCache'

export { default as getIsGitProject } from '#lib/git/getIsGitProject'
export { default as searchBranches } from '#lib/git/searchBranches'
export { default as getCurrentBranch } from '#lib/git/getCurrentBranch'
export { default as getGitLogs } from '#lib/git/getGitLogs'
export { default as getGitLogsByCommitIDs } from '#lib/git/getGitLogsByCommitIDs'
export { default as getGitVersion } from '#lib/git/getGitVersion'
export { default as getGitConfig } from '#lib/git/getGitConfig'
export { default as getGitRevParse } from '#lib/git/getGitRevParse'
export { default as getAheadLogs } from '#lib/git/getAheadLogs'
export { default as getBehindLogs } from '#lib/git/getBehindLogs'
export { default as getIsBranchOrCommitExist } from '#lib/git/getIsBranchOrCommitExist'
export { default as getIsMergeAction } from '#lib/git/getIsMergeAction'
export { default as getIsMergedTargetBranch } from '#lib/git/getIsMergedTargetBranch'
export { default as getIsUpdatedInTime } from '#lib/git/getIsUpdatedInTime'
export { getGitEmail, getGitToken, getGitUser } from '#lib/git/getGitUser'
export { default as getBranchesFromID } from '#lib/git/getBranchesFromID'
export { default as getGitStatus } from '#lib/git/getGitStatus'
export { default as getCommandMessage } from '#lib/git/getCommandMessage'
export { default as checkGitStatus } from '#lib/git/checkGitStatus'
export { default as getStashList } from '#lib/git/getStashList'
export { default as fetch } from '#lib/git/fetch'

export { default as cleanConfigSet } from '#lib/go/cleanConfigSet'
export { default as createPrompt } from '#lib/go/createPrompt'
export { default as getCommand } from '#lib/go/getCommand'

// export { default as hook } from '#lib/hook'

// const {
// 	init,
// 	remove,
// 	createHooks,
// 	removeHooks,
// 	createHookShell,
// 	removeHookShell,
// 	createLocalShell,
// 	removeLocalShell
// } = hook

export { enUS, zhCN } from '#lib/locales'
export type { TranslatePair, Language } from '#lib/locales'

export { default as getCurlOfMergeRequest } from '#lib/shell/getCurlOfMergeRequest'

export { isFileExist, writeFile } from '#lib/utils/file'
export { createArgs } from '#lib/utils/command'
export { default as getSeconds } from '#lib/utils/getSeconds'
export { decodeUnicode, encodeUnicode } from '#lib/utils/unicode'
export { cleanPkgInfo, getPkgInfo } from '#lib/utils/pkgInfo'
export { default as readPkg } from '#lib/utils/readPkg'
export { getMessage, postMessage } from '#lib/utils/message'
export { default as echo } from '#lib/utils/echo'
export { debug, isDebug } from '#lib/utils/debug'

export { default } from './index.default'
export const version = '__VERSION__' as string
