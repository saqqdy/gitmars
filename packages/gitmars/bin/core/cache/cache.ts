const path = require('path')
const { writeFile, isFileExist } = require('../utils/file')

type TimestampType = {
    [prop: string]: number
} & {
    packageInfoTime?: number
}

const cacheDir = path.join(__dirname, '../../../cache')

/**
 * 获取缓存是否过期
 *
 * @param name - 缓存名称
 * @param time - 过期时长，默认24 * 60 * 60 * 1000
 * @returns isCacheExpired - 返回是否过期
 */
function isCacheExpired(
    name: keyof TimestampType,
    time: number = 24 * 60 * 60 * 1000
) {
    const now = new Date().getTime()
    let timestamp: TimestampType = {}
    if (!name) throw '请传入名称'
    // 没有找到缓存文件
    if (!isFileExist(cacheDir + '/timestamp.json')) return true
    // 从文件读取时间戳
    timestamp = require(cacheDir + '/timestamp.json')
    return !timestamp[name] || now - timestamp[name]! >= time
}

/**
 * 更新缓存
 *
 * @param name - 缓存名称
 */
async function updateCacheTime(name: keyof TimestampType) {
    const now = new Date().getTime()
    let timestamp: TimestampType = {}
    if (!name) throw '请传入名称'
    // 没有找到缓存文件
    if (isFileExist(cacheDir + '/timestamp.json')) {
        timestamp = require(cacheDir + '/timestamp.json')
    }
    timestamp[name] = now
    await writeFile(cacheDir + '/timestamp.json', JSON.stringify(timestamp))
}

module.exports = {
    isCacheExpired,
    updateCacheTime
}
export {}
