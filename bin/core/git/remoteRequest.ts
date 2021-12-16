const { red } = require('colors')
const request = require('../request')
const getConfig = require('../getConfig')
const { debug } = require('../utils/debug')
const config = getConfig()

const MERGE_REQUESTS_URL = `${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests`

/**
 * 发起远程合并请求
 *
 * @param option - options
 * @returns command
 */
async function createMergeRequest({
    source_branch,
    target_branch,
    token,
    description
}: {
    [prop: string]: string | undefined
}) {
    const params: {
        [prop: string]: string | undefined
    } = {
        source_branch,
        target_branch,
        private_token: token,
        title: `Merge branch '${source_branch}' into '${target_branch}'`
    }
    if (description) {
        params.description = description
    }
    const fetchData = await request.post({
        url: MERGE_REQUESTS_URL,
        data: params
    })
    debug('fetchData', fetchData)
    if (fetchData && 'message' in fetchData) {
        const message = fetchData.message
            ? [].concat(fetchData.message).join('')
            : '请求报错了'
        return Promise.reject(red(message))
    }
    return fetchData
}

/**
 * 获取远程合并请求列表
 *
 * @param option - options
 * @returns command
 */
async function getMergeRequestList({
    state = 'opened',
    token
}: {
    [prop: string]: string | undefined
}) {
    const params: {
        [prop: string]: string | undefined
    } = {
        state,
        private_token: token
    }
    const fetchData = await request.get({
        url: MERGE_REQUESTS_URL,
        data: params
    })
    debug('fetchData', fetchData)
    if (fetchData && 'message' in fetchData) {
        const message = fetchData.message
            ? [].concat(fetchData.message).join('')
            : '请求报错了'
        return Promise.reject(red(message))
    }
    return fetchData
}

/**
 * 获取合并请求的commits
 *
 * @param option - options
 * @returns command
 */
async function getMergeRequestCommits({
    iid,
    token
}: {
    iid: string
    token: string
}) {
    const params = {
        private_token: token
    }
    const fetchData = await request.get({
        url: `${MERGE_REQUESTS_URL}/${iid}/commits`,
        data: params
    })
    debug('fetchData', fetchData)
    if (fetchData && 'message' in fetchData) {
        const message = fetchData.message
            ? [].concat(fetchData.message).join('')
            : '请求报错了'
        return Promise.reject(red(message))
    }
    return fetchData
}

/**
 * 获取合并请求的close issues
 *
 * @param option - options
 * @returns command
 */
async function getMergeRequestCloseIssues({
    iid,
    token
}: {
    iid: string
    token: string
}) {
    const params = {
        private_token: token
    }
    const fetchData = await request.get({
        url: `${MERGE_REQUESTS_URL}/${iid}/closes_issues`,
        data: params
    })
    debug('fetchData', fetchData)
    if (fetchData && 'message' in fetchData) {
        const message = fetchData.message
            ? [].concat(fetchData.message).join('')
            : '请求报错了'
        return Promise.reject(red(message))
    }
    return fetchData
}

/**
 * 获取合并请求的参与者
 *
 * @param option - options
 * @returns command
 */
async function getMergeRequestParticipants({
    iid,
    token
}: {
    iid: string
    token: string
}) {
    const params = {
        private_token: token
    }
    const fetchData = await request.get({
        url: `${MERGE_REQUESTS_URL}/${iid}/participants`,
        data: params
    })
    debug('fetchData', fetchData)
    if (fetchData && 'message' in fetchData) {
        const message = fetchData.message
            ? [].concat(fetchData.message).join('')
            : '请求报错了'
        return Promise.reject(red(message))
    }
    return fetchData
}

/**
 * 获取合并请求的changes
 *
 * @param option - options
 * @returns command
 */
async function getMergeRequestChanges({
    iid,
    token
}: {
    iid: string
    token: string
}) {
    const params = {
        private_token: token
    }
    const fetchData = await request.get({
        url: `${MERGE_REQUESTS_URL}/${iid}/changes`,
        data: params
    })
    debug('fetchData', fetchData)
    if (fetchData && 'message' in fetchData) {
        const message = fetchData.message
            ? [].concat(fetchData.message).join('')
            : '请求报错了'
        return Promise.reject(red(message))
    }
    return fetchData
}

/**
 * 获取合并请求的差异版本
 *
 * @param option - options
 * @returns command
 */
async function getMergeRequestDiffVersions({
    iid,
    token
}: {
    iid: string
    token: string
}) {
    const params = {
        private_token: token
    }
    const fetchData = await request.get({
        url: `${MERGE_REQUESTS_URL}/${iid}/versions`,
        data: params
    })
    debug('fetchData', fetchData)
    if (fetchData && 'message' in fetchData) {
        const message = fetchData.message
            ? [].concat(fetchData.message).join('')
            : '请求报错了'
        return Promise.reject(red(message))
    }
    return fetchData
}

/**
 * 确认合并请求
 *
 * @param option - options
 * @returns command
 */
async function acceptMergeRequest({
    iid,
    token
}: {
    iid: string
    token: string
}) {
    const params = {
        private_token: token
    }
    const fetchData = await request.put({
        url: `${MERGE_REQUESTS_URL}/${iid}/merge`,
        data: params,
        options: { error: true }
    })
    debug('fetchData', fetchData)
    if (fetchData && 'message' in fetchData) {
        const message = fetchData.message
            ? [].concat(fetchData.message).join('')
            : '请求报错了'
        if (message === '500 Internal Server Error') return true
        return Promise.reject(red(message))
    }
    return fetchData
}

/**
 * 更新合并请求
 *
 * @param option - options
 * @returns command
 */
async function updateMergeRequest({
    iid,
    token,
    data = {}
}: {
    iid: string
    token: string
    data: any
}) {
    data.private_token = token
    const fetchData = await request.put({
        url: `${MERGE_REQUESTS_URL}/${iid}`,
        data,
        options: { error: true }
    })
    debug('fetchData', fetchData)
    if (fetchData && 'message' in fetchData) {
        const message = fetchData.message
            ? [].concat(fetchData.message).join('')
            : '请求报错了'
        if (message === '500 Internal Server Error') return true
        return Promise.reject(red(message))
    }
    return fetchData
}

/**
 * 删除合并请求
 *
 * @param option - options
 * @returns command
 */
async function deleteMergeRequest({
    iid,
    token
}: {
    iid: string
    token: string
}) {
    const params = {
        private_token: token
    }
    const fetchData = await request.delete({
        url: `${MERGE_REQUESTS_URL}/${iid}`,
        data: params,
        options: { error: true }
    })
    debug('fetchData', fetchData)
    if (fetchData && 'message' in fetchData) {
        const message = fetchData.message
            ? [].concat(fetchData.message).join('')
            : '请求报错了'
        if (message === '500 Internal Server Error') return true
        return Promise.reject(red(message))
    }
    return fetchData
}

module.exports = {
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
