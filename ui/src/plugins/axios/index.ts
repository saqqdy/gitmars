import axios from 'axios'
import qs from 'qs'

export default function (options) {
	return new Promise((resolve, reject) => {
		// 默认配置
		const instance = axios.create()
		// const token = getCookie('token')
		instance.defaults.headers.post['Content-Type'] =
			'application/x-www-form-urlencoded'
		instance.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
		// if (token) {
		// 	instance.defaults.headers.common['authorization'] = token
		// }
		// 拦截器
		// 添加一个请求拦截器
		instance.interceptors.request.use(
			config => {
				const type = options.type
				if (process.env.NODE_ENV === 'development') {
					config.url = '/jar' + config.url
				}
				config.data = Object.assign(
					{},
					{ _time: Date.now() },
					config.data
				)
				if (type == 'post') {
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
			},
			err => {
				return Promise.reject(err)
			}
		)
		// 添加一个响应拦截器
		instance.interceptors.response.use(
			res => {
				// @ts-ignore
				if (res.data.success || options.responseType === 'text') {
					return res.data
				} else {
					return Promise.reject(res.data)
				}
			},
			err => {
				return Promise.reject(err)
			}
		)
		instance(options)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				if (err instanceof Error) {
					// 请求错误
					console.log(err)
				}
			})
	})
}
