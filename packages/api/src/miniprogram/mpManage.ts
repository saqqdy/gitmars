import { get, post } from '../request/miniprogram'
import type { WeiXinComponentCommonResult } from '../types'

const URL_PREFIX = '/api/component/weixin/mpManage'

export interface GetAuditStatus extends WeiXinComponentCommonResult {
	status: number
	time?: number
	reason?: string
}
/**
 * 获取代码审核状态
 *
 * @param authorizer_appid - authorizer appid
 * @returns data
 */
export function getAuditStatus(authorizer_appid: string) {
	return post<GetAuditStatus>({
		url: `${URL_PREFIX}/code/getAuditStatus`,
		data: {
			authorizer_appid
		}
	})
}

export interface GetTrialQrCodeOptions {
	authorizer_appid: string
	path?: string
}
/**
 * 获取体验二维码
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
			path
		}
	})
}

/**
 * 撤回审核
 *
 * @param authorizer_appid - authorizer appid
 * @returns data
 */
export function undoAudit(authorizer_appid: string) {
	return get<WeiXinComponentCommonResult>({
		url: `${URL_PREFIX}/code/undoAudit`,
		data: {
			authorizer_appid
		}
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
 * 提交代码审核
 *
 * @param options - options
 * @returns data
 */
export function submitAudit<T extends SubmitAuditOptions>(options: T) {
	return post<SubmitAudit>({
		url: `${URL_PREFIX}/code/submitAudit`,
		data: options || {}
	})
}

export type GetTester = Array<{
	userstr: string
}>
/**
 * 获取体验者
 *
 * @param options - options
 * @returns data
 */
export function getTester(authorizer_appid: string) {
	return post<GetTester>({
		url: `${URL_PREFIX}/member/getTester`,
		data: {
			authorizer_appid,
			action: 'get_experiencer'
		}
	})
}

export interface BindTesterOptions {
	authorizer_appid: string
	wechatid: string
}
/**
 * 绑定体验者
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
			wechatid
		}
	})
}

export interface UnbindTesterOptions {
	authorizer_appid: string
	userstr: string
}
/**
 * 解绑体验者
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
			userstr
		}
	})
}

export default {
	getAuditStatus,
	getTrialQrCode,
	undoAudit,
	submitAudit,
	getTester,
	bindTester,
	unbindTester
}
