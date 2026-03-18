import type { ApolloConfigType } from '@gitmars/build'
import { getBuildConfig } from '@gitmars/build'
import { getGitMiniprogramSession, getGitMiniprogramToken } from '@gitmars/git'
import { debug } from '@gitmars/utils'
import request from '@jssj/request'
import chalk from 'chalk'

export interface RequestConfig {
	url: string
	data: Record<string, any>
	headers?: Record<string, unknown>
	options?: Record<string, unknown>
}

let buildConfig: ApolloConfigType

export const post = async <P = unknown>(options: RequestConfig): Promise<P> => {
	if (!buildConfig) buildConfig = (await getBuildConfig()) as ApolloConfigType
	if (!options.url.startsWith('http')) options.url = buildConfig.miniprogramDomain + options.url
	const miniprogramToken = getGitMiniprogramToken(false) || buildConfig.miniprogramToken
	const miniprogramSession = getGitMiniprogramSession(false) || buildConfig.miniprogramSession

	options.headers = Object.assign(options.headers || {}, {
		Authorization: miniprogramToken,
		cookie: `kop=${miniprogramSession}`,
	})

	return new Promise((resolve, reject) => {
		request
			.post(options)
			.then(res => {
				debug('fetchData', res)
				if (res.success) resolve(res.data)
				else reject(chalk.red(res.msg))
			})
			.catch(reject)
	})
}

export const get = async <P = unknown>(options: RequestConfig): Promise<P> => {
	if (!buildConfig) buildConfig = (await getBuildConfig()) as ApolloConfigType
	if (!options.url.startsWith('http')) options.url = buildConfig.miniprogramDomain + options.url
	const miniprogramToken = getGitMiniprogramToken(false) || buildConfig.miniprogramToken
	const miniprogramSession = getGitMiniprogramSession(false) || buildConfig.miniprogramSession

	options.headers = Object.assign(options.headers || {}, {
		Authorization: miniprogramToken,
		cookie: `kop=${miniprogramSession}`,
	})

	return new Promise((resolve, reject) => {
		request
			.get(options)
			.then(res => {
				debug('fetchData', res)
				if (res.success) resolve(res.data)
				else reject(chalk.red(res.msg))
			})
			.catch(reject)
	})
}
