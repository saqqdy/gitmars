import { createRequire } from 'node:module'
import apollo from 'node-apollo'
import sh from 'shelljs'
import request from '@jssj/request'
import chalk from 'chalk'
import to from 'await-to-done'
import { CACHE_PATH, isCacheExpired, updateCacheTime } from '@gitmars/cache'
import { debug, isFileExist, removeFile, writeFile } from '@gitmars/utils'
import { getConfig } from '@gitmars/git'
import type {
	ApolloBranchList,
	ApolloConfigProjectType,
	ApolloConfigType,
	GitmarsConfigApisBuildConfigType,
	GitmarsConfigType
} from './types'
import lang from './lang'

const { t } = lang
const require = createRequire(import.meta.url)

/**
 * 获取namespace
 *
 * @param params - GitmarsConfigApisBuildConfigType['params']
 * @returns string - namespace
 */
function getNamespace(params: GitmarsConfigApisBuildConfigType['params'] = {}): string {
	const names = []
	const keys = Object.keys(params).sort((a, b) => a.length - b.length)
	for (const key of keys) {
		if (params[key] && typeof params[key] === 'string') {
			names.push(params[key])
		}
	}
	if (names.length) return names.join('-')
	return 'gitmars'
}

/**
 * 读取构建配置
 *
 * @param exitOnError - exit process when error occurred
 * @returns buildConfig - Return the configuration object
 */
export async function getBuildConfig(exitOnError = true): Promise<ApolloConfigType | undefined> {
	const config = getConfig() as GitmarsConfigType
	const { apis = {} } = config
	let NS, _buildConfig
	debug('getBuildConfig', config)

	if (apis.buildConfig) {
		NS = getNamespace(apis.buildConfig.params || {})
	} else if (config.apolloConfig) {
		const { appId, clusterName } = config.apolloConfig
		NS = getNamespace({ appId, clusterName })
	} else {
		if (exitOnError) {
			sh.echo(chalk.red(t('Please configure apollo or buildConfigApi')))
			process.exit(0)
		}
		return
	}

	const BUILD_CONFIG_TIME_NAME = `buildConfigTime-${NS}`
	const BUILD_CONFIG_PATH = `${CACHE_PATH}/buildConfig-${NS}.json`
	// 有配置文件且没有过期，返回配置
	if (!isCacheExpired(BUILD_CONFIG_TIME_NAME) && isFileExist(BUILD_CONFIG_PATH)) {
		return require(BUILD_CONFIG_PATH)
	}

	if (apis.buildConfig) {
		// 优先使用api获取配置
		const { url, method = 'get', params = {} } = apis.buildConfig
		_buildConfig =
			(
				await request[method]({
					url,
					data: params
				})
			).data || {}
	} else if (config.apolloConfig) {
		let apolloConfig
		// 如果传入的是json字符串，转json
		if (typeof config.apolloConfig === 'string') {
			try {
				apolloConfig = JSON.parse(config.apolloConfig)
			} catch {
				return
			}
		} else {
			apolloConfig = config.apolloConfig
		}
		_buildConfig = (await apollo.remoteConfigService(apolloConfig)).content || {}
	}

	await updateCacheTime(BUILD_CONFIG_TIME_NAME)
	await writeFile(BUILD_CONFIG_PATH, JSON.stringify(_buildConfig))
	return _buildConfig
}

/**
 * 读取项目配置
 *
 * @param projectName - project name
 * @param env - env type, ApolloBranchList
 * @param config - build config, not required
 * @returns buildConfig - Return the configuration object
 */
export async function getProjectOption(
	projectName: string,
	env: ApolloBranchList,
	config?: ApolloConfigType
): Promise<ApolloConfigProjectType | undefined> {
	if (!config) {
		;[, config] = await to(getBuildConfig().then(res => res || undefined))
	}
	return config?.[env]?.list?.find(item => item.name === projectName)
}

export function cleanBuildConfig() {
	removeFile([
		{
			name: t('Jenkins build configuration cache file'),
			url: CACHE_PATH + '/buildConfig*.json'
		},
		{
			url: CACHE_PATH + '/buildConfig.txt'
		}
	])
}
