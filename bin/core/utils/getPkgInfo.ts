const path = require('path')
const getProperty = require('js-cool/lib/getProperty')
const { writeFile, isFileExist } = require('./file')
const { isCacheExpired, updateCacheTime } = require('../cache/cache')
const { spawnSync } = require('../spawn')

const cacheDir = path.join(__dirname, '../../../cache')

/**
 * 读取gitmars在线版本列表
 *
 * @param name - 需要查询的内容
 * @returns {Object} arr 返回配置对象
 */
async function getPkgInfo(name: string): Promise<unknown | void> {
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
        packageInfo = JSON.parse(stdout)
    } catch {
        throw '出错了'
    }
    await updateCacheTime('packageInfoTime')
    await writeFile(cacheDir + '/packageInfo.json', JSON.stringify(packageInfo))
    return name ? getProperty(packageInfo, name) : packageInfo
}

module.exports = getPkgInfo
export {}
