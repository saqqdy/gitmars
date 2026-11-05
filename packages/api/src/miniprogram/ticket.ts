import { post } from '../request/miniprogram'

const URL_PREFIX = '/api/component/weixin/ticket'

/**
 * Generate an authorization code
 *
 * @param options - options
 * @returns data
 */
export function getPreAuthQrCode(): Promise<string> {
	return post({
		url: `${URL_PREFIX}/getPreAuthQrCode`,
		data: {},
	})
}

export default {
	getPreAuthQrCode,
}
