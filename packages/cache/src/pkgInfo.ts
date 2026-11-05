import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { isFileExist, removeFile, spawnSync, writeFile } from '@gitmars/utils'
import { getProperty } from 'js-cool'
import { isCacheExpired, updateCacheTime } from './cache'
import lang from './lang'
import { CACHE_PATH } from './paths'

const { t } = lang
const require = createRequire(import.meta.url)

/**
 * Get the online version list of gitmars
 *
 * @param name - Content to query
 * @returns info - The package info, or a specific property when name is passed
 */
export async function getPkgInfo(name?: string): Promise<any | void> {
	let packageInfo

	// Return the cached info when it exists and has not expired
	if (
		!isCacheExpired('packageInfoTime') &&
		isFileExist(resolve(`${CACHE_PATH}packageInfo.json`))
	) {
		packageInfo = require(resolve(`${CACHE_PATH}packageInfo.json`))

		return name ? getProperty(packageInfo, name) : packageInfo
	}
	const { stdout } = spawnSync('npm', ['view', 'gitmars', '--json'])

	try {
		packageInfo = JSON.parse(stdout!)
	} catch {
		throw t('An error occurred')
	}
	await updateCacheTime('packageInfoTime')
	await writeFile(resolve(`${CACHE_PATH}packageInfo.json`), JSON.stringify(packageInfo))

	return name ? getProperty(packageInfo, name) : packageInfo
}

/**
 * Clear the pkgInfo cache
 */
export function cleanPkgInfo() {
	removeFile({
		name: t('Gitmars package cache file'),
		url: resolve(`${CACHE_PATH}packageInfo.json`),
	})
}
