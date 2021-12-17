const getUserToken = require('./getUserToken')
const {
    createMergeRequest,
    getMergeRequestList,
    getMergeRequestCommits,
    getMergeRequestCloseIssues,
    getMergeRequestParticipants,
    getMergeRequestChanges,
    getMergeRequestDiffVersions,
    acceptMergeRequest,
    updateMergeRequest,
    deleteMergeRequest
} = require('./mergeRequest')

module.exports = {
    getUserToken,
    createMergeRequest,
    getMergeRequestList,
    getMergeRequestCommits,
    getMergeRequestCloseIssues,
    getMergeRequestParticipants,
    getMergeRequestChanges,
    getMergeRequestDiffVersions,
    acceptMergeRequest,
    updateMergeRequest,
    deleteMergeRequest
}
export {}
