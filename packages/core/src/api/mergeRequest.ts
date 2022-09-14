import chalk from 'chalk'
import request from '@jssj/request'
import getConfig from '#lib/getConfig'
import { debug } from '#lib/utils/debug'
import i18n from '#lib/locales/index'
const config = getConfig()

const MERGE_REQUESTS_URL = `${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests`

/**
 * 发起远程合并请求
 *
 * @param option - options
 * @returns command
 */
export async function createMergeRequest({
    source_branch,
    target_branch,
    description,
    token
}: {
    source_branch: string
    target_branch: string
    description: string
    token: string
}) {
    const params: {
        source_branch: string
        target_branch: string
        title: string
        description?: string
        private_token: string
    } = {
        source_branch,
        target_branch,
        title: `Merge branch '${source_branch}' into '${target_branch}'`,
        private_token: token
    }
    if (description) params.description = description
    const fetchData = await request.post({
        url: MERGE_REQUESTS_URL,
        data: params
    })
    debug('fetchData', fetchData)
    if (fetchData && 'message' in fetchData) {
        const message = fetchData.message
            ? [].concat(fetchData.message).join('')
            : i18n.__('The request reported an error')
        return Promise.reject(chalk.red(message))
    }
    return fetchData
}

/**
 * 获取远程合并请求列表
 *
 * @param option - options
 * @returns command
 */
export async function getMergeRequestList({
    state = 'opened',
    token
}: {
    state: 'merged' | 'opened' | 'closed' | 'all'
    token: string
}) {
    const params = {
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
            : i18n.__('The request reported an error')
        return Promise.reject(chalk.red(message))
    }
    return fetchData
}

/**
 * 获取合并请求的commits
 *
 * @param option - options
 * @returns command
 */
export async function getMergeRequestCommits({
    iid,
    token
}: {
    iid: number | string
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
            : i18n.__('The request reported an error')
        return Promise.reject(chalk.red(message))
    }
    return fetchData
}

/**
 * 获取合并请求的close issues
 *
 * @param option - options
 * @returns command
 */
export async function getMergeRequestCloseIssues({
    iid,
    token
}: {
    iid: number | string
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
            : i18n.__('The request reported an error')
        return Promise.reject(chalk.red(message))
    }
    return fetchData
}

/**
 * 获取合并请求的参与者
 *
 * @param option - options
 * @returns command
 */
export async function getMergeRequestParticipants({
    iid,
    token
}: {
    iid: number | string
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
            : i18n.__('The request reported an error')
        return Promise.reject(chalk.red(message))
    }
    return fetchData
}

/**
 * 获取合并请求的changes
 *
 * @param option - options
 * @returns command
 */
export async function getMergeRequestChanges({
    iid,
    token
}: {
    iid: number | string
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
            : i18n.__('The request reported an error')
        return Promise.reject(chalk.red(message))
    }
    return fetchData
}

/**
 * 获取合并请求的差异版本
 *
 * @param option - options
 * @returns command
 */
export async function getMergeRequestDiffVersions({
    iid,
    token
}: {
    iid: number | string
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
            : i18n.__('The request reported an error')
        return Promise.reject(chalk.red(message))
    }
    return fetchData
}

/**
 * 确认合并请求
 *
 * @param option - options
 * @returns command
 */
export async function acceptMergeRequest({
    iid,
    token
}: {
    iid: number | string
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
            : i18n.__('The request reported an error')
        if (message === '500 Internal Server Error') return true
        return Promise.reject(chalk.red(message))
    }
    return fetchData
}

/**
 * 更新合并请求
 *
 * @param option - options
 * @returns command
 */
export async function updateMergeRequest({
    iid,
    token,
    data = {}
}: {
    iid: number | string
    token: string
    data: unknown & {
        private_token?: string
    }
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
            : i18n.__('The request reported an error')
        if (message === '500 Internal Server Error') return true
        return Promise.reject(chalk.red(message))
    }
    return fetchData
}

/**
 * 删除合并请求
 *
 * @param option - options
 * @returns command
 */
export async function deleteMergeRequest({
    iid,
    token
}: {
    iid: number | string
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
            : i18n.__('The request reported an error')
        if (message === '500 Internal Server Error') return true
        return Promise.reject(chalk.red(message))
    }
    return fetchData
}

export default {
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
