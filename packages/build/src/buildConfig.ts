import type {
	ApolloBranchList,
	ApolloConfigProjectType,
	ApolloConfigType,
	GitmarsConfigApisBuildConfigType,
	GitmarsConfigType,
} from './types'
import { createRequire } from 'node:module'
import { CACHE_PATH, isCacheExpired, updateCacheTime } from '@gitmars/cache'
import { getConfig } from '@gitmars/git'
import { debug, isFileExist, removeFile, writeFile } from '@gitmars/utils'
import request from '@jssj/request'
import to from 'await-to-done'
import chalk from 'chalk'
import apollo from 'node-apollo'
import sh from 'shelljs'
import lang from './lang'

const { t } = lang
const require = createRequire(import.meta.url)

/**
 * Get the namespace
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
 * Inject the buildSecret from .gitmarsrc into the build config.
 *
 * Sensitive data (username/password, etc.) is no longer returned via the build
 * config API; it is provided by the local .gitmarsrc instead, with project-level entries
 * overriding global ones (the two-level merge is done in getConfig). Only fields present in
 * buildSecret are overridden; the rest are kept from the API response.
 *
 * @param config - build config returned by the API/apollo
 * @param gitmarsConfig - merged gitmarsrc config carrying buildSecret
 * @returns config - build config with secret fields injected
 */
function mergeBuildSecret(
	config: ApolloConfigType,
	gitmarsConfig: GitmarsConfigType,
): ApolloConfigType {
	const secret = gitmarsConfig.buildSecret

	if (!secret) return config

	const result: ApolloConfigType = { ...config }

	if (secret.username) result.username = secret.username
	if (secret.password) result.password = secret.password
	if (secret.miniprogramToken) result.miniprogramToken = secret.miniprogramToken
	if (secret.miniprogramSession) result.miniprogramSession = secret.miniprogramSession
	if (secret.gitNotificationGroupUrl)
		result.gitNotificationGroupUrl = secret.gitNotificationGroupUrl

	return result
}

/**
 * Strip sensitive fields from the build config.
 *
 * Called before writing to the local cache so that sensitive data is never persisted
 * to the cache file.
 *
 * @param config - build config returned by the API/apollo
 * @returns config - build config with sensitive fields stripped
 */
function stripSecret(config: ApolloConfigType): ApolloConfigType {
	const stripped = { ...config } as Record<string, unknown>

	delete stripped.username
	delete stripped.password
	delete stripped.miniprogramToken
	delete stripped.miniprogramSession
	delete stripped.gitNotificationGroupUrl

	return stripped as ApolloConfigType
}

/**
 * Read the build config
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

	// Return the cached config when it exists and has not expired
	if (!isCacheExpired(BUILD_CONFIG_TIME_NAME) && isFileExist(BUILD_CONFIG_PATH)) {
		return mergeBuildSecret(require(BUILD_CONFIG_PATH), config)
	}

	if (apis.buildConfig) {
		// Prefer fetching the config from the API
		const { url, method = 'get', params = {} } = apis.buildConfig

		_buildConfig =
			(
				await request[method]({
					url,
					data: params,
				})
			).data || {}
	} else if (config.apolloConfig) {
		let apolloConfig

		// Parse the value as JSON when a JSON string is passed
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
	await writeFile(BUILD_CONFIG_PATH, JSON.stringify(stripSecret(_buildConfig)))

	return mergeBuildSecret(_buildConfig, config)
}

/**
 * Read the project config
 *
 * @param projectName - project name
 * @param env - env type, ApolloBranchList
 * @param config - build config, not required
 * @returns buildConfig - Return the configuration object
 */
export async function getProjectOption(
	projectName: string,
	env: ApolloBranchList,
	config?: ApolloConfigType,
): Promise<ApolloConfigProjectType | undefined> {
	if (!config) {
		;[, config] = await to(getBuildConfig(false).then(res => res || undefined))
	}

	return config?.[env]?.list?.find(item => item.name === projectName)
}

export function cleanBuildConfig() {
	removeFile([
		{
			name: t('Jenkins build configuration cache file'),
			url: `${CACHE_PATH}/buildConfig*.json`,
		},
		{
			url: `${CACHE_PATH}/buildConfig.txt`,
		},
	])
}
