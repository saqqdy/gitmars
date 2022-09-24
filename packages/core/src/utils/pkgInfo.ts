import { resolve } from 'path'
import { createRequire } from 'node:module'
import getProperty from 'js-cool/es/getProperty'
import { spawnSync } from '#lib/spawn'
import { isCacheExpired, updateCacheTime } from '#lib/cache/cache'
import { CACHE_PATH } from '#lib/utils/paths'
import { isFileExist, removeFile, writeFile } from '#lib/utils/file'
import lang from '#lib/lang'

const { t } = lang
const require = createRequire(import.meta.url)

/**
 * 读取gitmars在线版本列表
 *
 * @param name - 需要查询的内容
 * @returns {Object} arr Return the configuration object
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
    await writeFile(
        resolve(CACHE_PATH + 'packageInfo.json'),
        JSON.stringify(packageInfo)
    )
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

export default {
    getPkgInfo,
    cleanPkgInfo
}
