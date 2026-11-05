import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { isFileExist, removeFile, writeFile } from '@gitmars/utils'
import lang from './lang'
import { CACHE_PATH } from './paths'

const { t } = lang
const require = createRequire(import.meta.url)

export type TimestampType = Record<string, number> & {
	packageInfoTime?: number
}

/**
 * Check whether the cache has expired
 *
 * @param name - Cache name
 * @param time - Expiration duration, defaults to 24 * 60 * 60 * 1000
 * @returns isCacheExpired - Whether the cache has expired
 */
export function isCacheExpired(name: keyof TimestampType, time: number = 24 * 60 * 60 * 1000) {
	const now = new Date().getTime()
	let timestamp: TimestampType = {}

	if (!name) throw t('Please pass in the name')
	// Cache file not found
	if (!isFileExist(resolve(`${CACHE_PATH}timestamp.json`))) return true
	// Read the timestamp from the file
	timestamp = require(resolve(`${CACHE_PATH}timestamp.json`))

	return !timestamp[name] || now - timestamp[name]! >= time
}

/**
 * Update the cache
 *
 * @param name - Cache name
 */
export async function updateCacheTime(name: keyof TimestampType) {
	const now = new Date().getTime()
	let timestamp: TimestampType = {}

	if (!name) throw t('Please pass in the name')
	// Cache file not found
	if (isFileExist(resolve(`${CACHE_PATH}timestamp.json`))) {
		timestamp = require(resolve(`${CACHE_PATH}timestamp.json`))
	}
	timestamp[name] = now
	await writeFile(resolve(`${CACHE_PATH}timestamp.json`), JSON.stringify(timestamp))
}

export async function cleanCache() {
	removeFile({
		name: t('Cache time Map file'),
		url: resolve(`${CACHE_PATH}timestamp.json`),
	})
}
