import { post } from '../request/miniprogram'

const URL_PREFIX = '/api/component/weixin/ticket'

/**
 * 生成授权码
 *
 * @param options - options
 * @returns data
 */
export function getPreAuthQrCode(): Promise<string> {
	return post({
		url: `${URL_PREFIX}/getPreAuthQrCode`,
		data: {}
	})
}

export default {
	getPreAuthQrCode
}
