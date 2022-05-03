import path from 'path'
import getProperty from 'js-cool/lib/getProperty'
import { isCacheExpired, updateCacheTime } from '../cache/cache'
import { spawnSync } from '../spawn'
import { isFileExist, writeFile } from './file'

const cacheDir = path.join(__dirname, '../../../cache')

/**
 * 读取gitmars在线版本列表
 *
 * @param name - 需要查询的内容
 * @returns {Object} arr 返回配置对象
 */
async function getPkgInfo(name?: string): Promise<any | void> {
    let packageInfo
    // 有配置文件且没有过期，返回配置
    if (
        !isCacheExpired('packageInfoTime') &&
        isFileExist(cacheDir + '/packageInfo.json')
    ) {
        packageInfo = require(cacheDir + '/packageInfo.json')
        return name ? getProperty(packageInfo, name) : packageInfo
    }
    const { stdout } = spawnSync('npm', ['view', 'gitmars', '--json'])
    try {
        packageInfo = JSON.parse(stdout!)
    } catch {
        throw '出错了'
    }
    await updateCacheTime('packageInfoTime')
    await writeFile(cacheDir + '/packageInfo.json', JSON.stringify(packageInfo))
    return name ? getProperty(packageInfo, name) : packageInfo
}

export default getPkgInfo
