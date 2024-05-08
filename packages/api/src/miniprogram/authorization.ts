import { post } from '../request/miniprogram'

const URL_PREFIX = '/api/component/weixin/authorization'

export interface GetAuthorizerListWithAllDetailOptions {
	current?: number
	limit?: number
	keyword?: string
}
export interface GetAuthorizerListWithAllDetailItem {
	auth_time: number
	authorization_info: {
		authorizer_appid: string
		func_info: Record<string, unknown>
	}
	authorizer_appid: string
	authorizer_info: {
		MiniProgramInfo: Record<string, unknown>
		account_status: number
		alias: string
		basic_config: Record<string, unknown>
		business_info: Record<string, unknown>
		head_img: string
		idc: number
		nick_name: string
		principal_name: string
		qrcode_url: string
		register_type: number
		service_type_info: Record<string, unknown>
		signature: string
		user_name: string
		verify_type_info: Record<string, unknown>
	}
	release_info: {
		release_desc: string
		release_time: number
		release_version: string
	}
}
export interface GetAuthorizerListWithAllDetail {
	total: number
	list: GetAuthorizerListWithAllDetailItem[]
	current: number
	limit: number
}
/**
 * getAuthorizerListWithAllDetail
 *
 * @param options - options
 * @returns data
 */
export async function getAuthorizerListWithAllDetail<
	T extends GetAuthorizerListWithAllDetailOptions
>(options?: T) {
	const { current = 1, limit = 50, keyword } = options || {}
	return post<GetAuthorizerListWithAllDetail>({
		url: `${URL_PREFIX}/getAuthorizerListWithAllDetail`,
		data: {
			current,
			limit,
			keyword
		}
	})
}

export default {
	getAuthorizerListWithAllDetail
}
