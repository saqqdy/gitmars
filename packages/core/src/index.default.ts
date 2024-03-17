import getUserInfo from '#lib/api/getUserInfo'
import {
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

import runJenkins from '#lib/build/runJenkins'
import { cleanBuildConfig, getBuildConfig } from '#lib/build/buildConfig'

import { cleanCache, isCacheExpired, updateCacheTime } from '#lib/cache/cache'
import { cleanLog, setLog } from '#lib/cache/log'
import { cleanCommandCache, getCommandCache, setCommandCache } from '#lib/cache/commandCache'
import {
	addRevertCache,
	cleanRevertCache,
	delRevertCache,
	getRevertCache,
	setRevertCache
} from '#lib/cache/revertCache'

import getIsGitProject from '#lib/git/getIsGitProject'
import searchBranches from '#lib/git/searchBranches'
import getCurrentBranch from '#lib/git/getCurrentBranch'
import getGitLogs from '#lib/git/getGitLogs'
import getGitLogsByCommitIDs from '#lib/git/getGitLogsByCommitIDs'
import getGitVersion from '#lib/git/getGitVersion'
import getGitConfig from '#lib/git/getGitConfig'
import getGitRevParse from '#lib/git/getGitRevParse'
import getAheadLogs from '#lib/git/getAheadLogs'
import getBehindLogs from '#lib/git/getBehindLogs'
import getIsBranchOrCommitExist from '#lib/git/getIsBranchOrCommitExist'
import getIsMergeAction from '#lib/git/getIsMergeAction'
import getIsMergedTargetBranch from '#lib/git/getIsMergedTargetBranch'
import getIsUpdatedInTime from '#lib/git/getIsUpdatedInTime'
import { getGitEmail, getGitToken, getGitUser } from '#lib/git/getGitUser'
import getBranchesFromID from '#lib/git/getBranchesFromID'
import getGitStatus from '#lib/git/getGitStatus'
import getCommandMessage from '#lib/git/getCommandMessage'
import checkGitStatus from '#lib/git/checkGitStatus'
import getStashList from '#lib/git/getStashList'
import fetch from '#lib/git/fetch'

import cleanConfigSet from '#lib/go/cleanConfigSet'
import createPrompt from '#lib/go/createPrompt'
import getCommand from '#lib/go/getCommand'

// import hook from '#lib/hook'

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

import { enUS, zhCN } from '#lib/locales'
export type { TranslatePair, Language } from '#lib/locales'

import getCurlOfMergeRequest from '#lib/shell/getCurlOfMergeRequest'

import { isFileExist, writeFile } from '#lib/utils/file'
import { createArgs } from '#lib/utils/command'
import getSeconds from '#lib/utils/getSeconds'
import { decodeUnicode, encodeUnicode } from '#lib/utils/unicode'
import { cleanPkgInfo, getPkgInfo } from '#lib/utils/pkgInfo'
import readPkg from '#lib/utils/readPkg'
import { getMessage, postMessage } from '#lib/utils/message'
import echo from '#lib/utils/echo'
import { debug, isDebug } from '#lib/utils/debug'

export default {
	version: '__VERSION__',
	// api
	getUserInfo,
	acceptMergeRequest,
	createMergeRequest,
	deleteMergeRequest,
	getMergeRequestChanges,
	getMergeRequestCloseIssues,
	getMergeRequestCommits,
	getMergeRequestDiffVersions,
	getMergeRequestList,
	getMergeRequestParticipants,
	updateMergeRequest,
	// build
	getBuildConfig,
	cleanBuildConfig,
	runJenkins,
	// cache
	cleanCache,
	isCacheExpired,
	updateCacheTime,
	cleanLog,
	setLog,
	cleanCommandCache,
	getCommandCache,
	setCommandCache,
	addRevertCache,
	cleanRevertCache,
	delRevertCache,
	getRevertCache,
	setRevertCache,
	// git
	getIsGitProject,
	searchBranches,
	getCurrentBranch,
	getGitLogs,
	getGitLogsByCommitIDs,
	getGitVersion,
	getGitConfig,
	getGitRevParse,
	getAheadLogs,
	getBehindLogs,
	getIsBranchOrCommitExist,
	getIsMergeAction,
	getIsMergedTargetBranch,
	getIsUpdatedInTime,
	getGitToken,
	getGitUser,
	getGitEmail,
	getBranchesFromID,
	getGitStatus,
	getCommandMessage,
	checkGitStatus,
	getStashList,
	fetch,
	// go
	cleanConfigSet,
	createPrompt,
	getCommand,
	// hook
	// init,
	// remove,
	// createHooks,
	// removeHooks,
	// createHookShell,
	// removeHookShell,
	// createLocalShell,
	// removeLocalShell,
	// locales
	zhCN,
	enUS,
	// shell
	getCurlOfMergeRequest,
	// utils
	writeFile,
	isFileExist,
	createArgs,
	getSeconds,
	encodeUnicode,
	decodeUnicode,
	getPkgInfo,
	cleanPkgInfo,
	readPkg,
	getMessage,
	postMessage,
	echo,
	isDebug,
	debug
}
