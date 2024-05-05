import { resolve } from 'path'
import { createRequire } from 'node:module'
import { isFileExist, removeFile, writeFile } from '@gitmars/utils'
import { CACHE_PATH } from './paths'
import lang from './lang'

const { t } = lang
const require = createRequire(import.meta.url)

export type TimestampType = Record<string, number> & {
	packageInfoTime?: number
}

/**
 * 获取缓存是否过期
 *
 * @param name - 缓存名称
 * @param time - 过期时长，默认24 * 60 * 60 * 1000
 * @returns isCacheExpired - 返回是否过期
 */
export function isCacheExpired(name: keyof TimestampType, time: number = 24 * 60 * 60 * 1000) {
	const now = new Date().getTime()
	let timestamp: TimestampType = {}
	if (!name) throw t('Please pass in the name')
	// 没有找到缓存文件
	if (!isFileExist(resolve(CACHE_PATH + 'timestamp.json'))) return true
	// 从文件读取时间戳
	timestamp = require(resolve(CACHE_PATH + 'timestamp.json'))
	return !timestamp[name] || now - timestamp[name]! >= time
}

/**
 * 更新缓存
 *
 * @param name - 缓存名称
 */
export async function updateCacheTime(name: keyof TimestampType) {
	const now = new Date().getTime()
	let timestamp: TimestampType = {}
	if (!name) throw t('Please pass in the name')
	// 没有找到缓存文件
	if (isFileExist(resolve(CACHE_PATH + 'timestamp.json'))) {
		timestamp = require(resolve(CACHE_PATH + 'timestamp.json'))
	}
	timestamp[name] = now
	await writeFile(resolve(CACHE_PATH + 'timestamp.json'), JSON.stringify(timestamp))
}

export async function cleanCache() {
	removeFile({
		name: t('Cache time Map file'),
		url: resolve(CACHE_PATH + 'timestamp.json')
	})
}
