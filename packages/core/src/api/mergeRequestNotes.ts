import chalk from 'chalk'
import request from '@jssj/request'
import getConfig from '#lib/getConfig'
import { debug } from '#lib/utils/debug'
import { getGitToken } from '#lib/git/getGitUser'
import lang from '#lib/lang'

const { t } = lang
const config = getConfig()

const MERGE_REQUESTS_NOTES_URL = `${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests`
const token = getGitToken()

/**
 * 发起远程合并请求日志
 *
 * @param option - options
 * @returns command
 */
export async function createMergeRequestNotes({
	iid,
	body,
	created_at
}: {
	iid: number | string
	body: string
	created_at?: string
}) {
	const params = {
		body,
		created_at,
		private_token: token
	}
	const fetchData = await request.post({
		url: `${MERGE_REQUESTS_NOTES_URL}/${iid}/notes`,
		data: params
	})
	debug('fetchData', fetchData)
	if (fetchData && 'message' in fetchData) {
		const message = fetchData.message
			? [].concat(fetchData.message).join('')
			: t('The request reported an error')
		return Promise.reject(chalk.red(message))
	}
	return fetchData
}

/**
 * 获取远程合并请求日志列表
 *
 * @param option - options
 * @returns command
 */
export async function getMergeRequestNotesList({
	iid,
	sort = 'desc',
	order_by = 'created_at'
}: {
	iid: number | string
	sort?: 'asc' | 'desc'
	order_by?: 'created_at' | 'updated_at'
}) {
	const params = {
		sort,
		order_by,
		private_token: token
	}
	const fetchData = await request.get({
		url: `${MERGE_REQUESTS_NOTES_URL}/${iid}/notes`,
		data: params
	})
	debug('fetchData', fetchData)
	if (fetchData && 'message' in fetchData) {
		const message = fetchData.message
			? [].concat(fetchData.message).join('')
			: t('The request reported an error')
		return Promise.reject(chalk.red(message))
	}
	return fetchData
}

/**
 * 获取远程合并请求日志详情
 *
 * @param option - options
 * @returns command
 */
export async function getMergeRequestNotesDetail({
	id,
	iid
}: {
	id: number | string
	iid: number | string
}) {
	const params = {
		private_token: token
	}
	const fetchData = await request.get({
		url: `${MERGE_REQUESTS_NOTES_URL}/${iid}/notes/${id}`,
		data: params
	})
	debug('fetchData', fetchData)
	if (fetchData && 'message' in fetchData) {
		const message = fetchData.message
			? [].concat(fetchData.message).join('')
			: t('The request reported an error')
		return Promise.reject(chalk.red(message))
	}
	return fetchData
}

/**
 * 更新合并请求日志
 *
 * @param option - options
 * @returns command
 */
export async function updateMergeRequestNotes({
	id,
	iid,
	body
}: {
	id: number | string
	iid: number | string
	body: string
}) {
	const fetchData = await request.put({
		url: `${MERGE_REQUESTS_NOTES_URL}/${iid}/notes/${id}`,
		data: {
			body,
			private_token: token
		},
		options: { error: true }
	})
	debug('fetchData', fetchData)
	if (fetchData && 'message' in fetchData) {
		const message = fetchData.message
			? [].concat(fetchData.message).join('')
			: t('The request reported an error')
		return Promise.reject(chalk.red(message))
	}
	return fetchData
}

/**
 * 删除合并请求日志
 *
 * @param option - options
 * @returns command
 */
export async function deleteMergeRequestNotes({
	id,
	iid
}: {
	id: number | string
	iid: number | string
}) {
	const params = {
		private_token: token
	}
	const fetchData = await request.delete({
		url: `${MERGE_REQUESTS_NOTES_URL}/${iid}/notes/${id}`,
		data: params,
		options: { error: true }
	})
	debug('fetchData', fetchData)
	if (fetchData && 'message' in fetchData) {
		const message = fetchData.message
			? [].concat(fetchData.message).join('')
			: t('The request reported an error')
		return Promise.reject(chalk.red(message))
	}
	return fetchData
}

export default {
	createMergeRequestNotes,
	getMergeRequestNotesList,
	getMergeRequestNotesDetail,
	updateMergeRequestNotes,
	deleteMergeRequestNotes
}
