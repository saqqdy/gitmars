import type { WeiXinComponentCommonResult } from '../types'
import { get, post } from '../request/miniprogram'

const URL_PREFIX = '/api/component/weixin/mpManage'

export interface GetAuditStatus extends WeiXinComponentCommonResult {
	status: number
	time?: number
	reason?: string
}
/**
 * Get the code review status
 *
 * @param authorizer_appid - authorizer appid
 * @returns data
 */
export function getAuditStatus(authorizer_appid: string) {
	return post<GetAuditStatus>({
		url: `${URL_PREFIX}/code/getAuditStatus`,
		data: {
			authorizer_appid,
		},
	})
}

export interface GetTrialQrCodeOptions {
	authorizer_appid: string
	path?: string
}
/**
 * Get the trial QR code
 *
 * @param options - options
 * @returns data
 */
export function getTrialQrCode<T extends GetTrialQrCodeOptions>(options: T) {
	const { authorizer_appid, path = '' } = options || {}

	return get<string>({
		url: `${URL_PREFIX}/code/getTrialQrCode`,
		data: {
			authorizer_appid,
			path,
		},
	})
}

/**
 * Withdraw a review
 *
 * @param authorizer_appid - authorizer appid
 * @returns data
 */
export function undoAudit(authorizer_appid: string) {
	return get<WeiXinComponentCommonResult>({
		url: `${URL_PREFIX}/code/undoAudit`,
		data: {
			authorizer_appid,
		},
	})
}

export interface SubmitAuditOptions {
	authorizer_appid: string
	item_list: Array<{
		first_class: string
		second_class: string
		first_id: number
		second_id: number
	}>
	feedback_info: string
	feedback_stuff: string
	version_desc: string
	preview_info: Record<string, unknown>
	ugc_declare: Record<string, unknown>
	privacy_api_not_use: boolean
}
export interface SubmitAudit extends WeiXinComponentCommonResult {
	auditid: number
}
/**
 * Submit code for review
 *
 * @param options - options
 * @returns data
 */
export function submitAudit<T extends SubmitAuditOptions>(options: T) {
	return post<SubmitAudit>({
		url: `${URL_PREFIX}/code/submitAudit`,
		data: options || {},
	})
}

export type GetTester = Array<{
	userstr: string
}>
/**
 * Get testers
 *
 * @param options - options
 * @returns data
 */
export function getTester(authorizer_appid: string) {
	return post<GetTester>({
		url: `${URL_PREFIX}/member/getTester`,
		data: {
			authorizer_appid,
			action: 'get_experiencer',
		},
	})
}

export interface BindTesterOptions {
	authorizer_appid: string
	wechatid: string
}
/**
 * Bind a tester
 *
 * @param options - options
 * @returns data
 */
export function bindTester<T extends BindTesterOptions>(options: T) {
	const { authorizer_appid, wechatid } = options || {}

	return post<string>({
		url: `${URL_PREFIX}/member/bindTester`,
		data: {
			authorizer_appid,
			wechatid,
		},
	})
}

export interface UnbindTesterOptions {
	authorizer_appid: string
	userstr: string
}
/**
 * Unbind a tester
 *
 * @param options - options
 * @returns data
 */
export function unbindTester<T extends UnbindTesterOptions>(options: T) {
	const { authorizer_appid, userstr } = options || {}

	return post<string>({
		url: `${URL_PREFIX}/member/unbindTester`,
		data: {
			authorizer_appid,
			userstr,
		},
	})
}

export default {
	getAuditStatus,
	getTrialQrCode,
	undoAudit,
	submitAudit,
	getTester,
	bindTester,
	unbindTester,
}
