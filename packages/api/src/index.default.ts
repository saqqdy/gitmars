import getUserInfo from './getUserInfo'
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
} from './mergeRequest'
import {
	createMergeRequestNotes,
	deleteMergeRequestNotes,
	getMergeRequestNotesDetail,
	getMergeRequestNotesList,
	updateMergeRequestNotes
} from './mergeRequestNotes'
import {
	getAuditStatus,
	getAuthorizerListWithAllDetail,
	getPreAuthQrCode,
	getTrialQrCode,
	submitAudit
} from './miniprogram'

export type * from './types'
export default {
	version: '__VERSION__',
	getUserInfo,
	createMergeRequest,
	getMergeRequestList,
	getMergeRequestCommits,
	getMergeRequestCloseIssues,
	getMergeRequestParticipants,
	getMergeRequestChanges,
	getMergeRequestDiffVersions,
	acceptMergeRequest,
	updateMergeRequest,
	deleteMergeRequest,
	// mergeRequestNotes
	createMergeRequestNotes,
	deleteMergeRequestNotes,
	getMergeRequestNotesDetail,
	getMergeRequestNotesList,
	updateMergeRequestNotes,
	// miniprogram
	getAuthorizerListWithAllDetail,
	getAuditStatus,
	getTrialQrCode,
	submitAudit,
	getPreAuthQrCode
}
