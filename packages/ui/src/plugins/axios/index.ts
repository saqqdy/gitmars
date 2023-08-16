import Vue from 'vue'
import qs from 'qs'
import axiosExtend, { type AxiosExtendConfig } from 'axios-ex'

let axiosEx: any = null

/**
 * @param instance
 */
// @ts-expect-error
function setHeaders(instance) {
	instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
	instance.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
}
// 请求拦截器
/**
 * @param config
 * @param options
 */
// @ts-expect-error
function onRequest(config, options = {}) {
	// @ts-expect-error
	const type = options.type
	if (process.env.NODE_ENV === 'development') {
		config.url = '/jar' + config.url
	}
	config.data = Object.assign({}, { _time: Date.now() }, config.data)
	if (type === 'post') {
		config.method = 'post'
		config.data = qs.stringify(config.data, {
			arrayFormat: 'indices',
			allowDots: true
		})
	} else {
		config.method = 'get'
		config.params = config.data
	}
	return config
}
// 响应拦截器
/**
 * @param res
 * @param options
 */
// @ts-expect-error
function onResponse(res, options = {}) {
	// @ts-expect-error
	if (res.data.success || options.responseType === 'text') {
		return res.data
	}
	return Promise.reject(res.data)
}
// 请求取消
/**
 * @param err
 */
// @ts-expect-error
function onCancel(err) {
	console.info(err.message)
}

/**
 * @param options
 */
export default function (options: AxiosExtendConfig) {
	if (!axiosEx)
		axiosEx = new axiosExtend({
			retries: 0,
			unique: false,
			orderly: true,
			setHeaders,
			// @ts-expect-error
			onRequest: onRequest.bind(this as any),
			// @ts-expect-error
			onResponse: onResponse.bind(this as any),
			onCancel
		})
	options.unique = options.unique ?? false
	options.orderly = options.orderly ?? true
	return new Promise((resolve, reject) => {
		axiosEx
			.create(options)
			.then((res: any) => {
				resolve(res)
			})
			.catch((err: Error) => {
				if (err instanceof Error) {
					// 请求错误
					console.log(err)
				}
			})
	})
}
