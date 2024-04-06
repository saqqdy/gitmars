import { resolve } from 'path'
import { createRequire } from 'node:module'
import { getProperty } from 'js-cool'
import { isFileExist, removeFile, spawnSync, writeFile } from '@gitmars/utils'
import { isCacheExpired, updateCacheTime } from './cache'
import { CACHE_PATH } from './paths'
import lang from './lang'

const { t } = lang
const require = createRequire(import.meta.url)

/**
 * 读取gitmars在线版本列表
 *
 * @param name - 需要查询的内容
 * @returns info - arr Return the configuration object
 */
export async function getPkgInfo(name?: string): Promise<any | void> {
	let packageInfo
	// 有配置文件且没有过期，返回配置
	if (
		!isCacheExpired('packageInfoTime') &&
		isFileExist(resolve(CACHE_PATH + 'packageInfo.json'))
	) {
		packageInfo = require(resolve(CACHE_PATH + 'packageInfo.json'))
		return name ? getProperty(packageInfo, name) : packageInfo
	}
	const { stdout } = spawnSync('npm', ['view', 'gitmars', '--json'])
	try {
		packageInfo = JSON.parse(stdout!)
	} catch {
		throw t('An error occurred')
	}
	await updateCacheTime('packageInfoTime')
	await writeFile(resolve(CACHE_PATH + 'packageInfo.json'), JSON.stringify(packageInfo))
	return name ? getProperty(packageInfo, name) : packageInfo
}

/**
 * 清理pkgInfo缓存
 */
export function cleanPkgInfo() {
	removeFile({
		name: t('Gitmars package cache file'),
		url: resolve(CACHE_PATH + 'packageInfo.json')
	})
}
