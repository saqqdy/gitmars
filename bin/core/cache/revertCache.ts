const sh = require('shelljs')
const getGitRevParse = require('../git/getGitRevParse')
const { writeFileSync, isFileExist } = require('../utils/file')

import type { RevertCacheType } from '../../../typings'

const { gitDir } = getGitRevParse()
const GITMARS_REVERT_CACHE_FILE = gitDir + '/gitmarsreverts.json'

/**
 * 获取revert缓存
 *
 * @returns reverts - revert缓存列表
 */
function getRevertCache() {
    let reverts: RevertCacheType[] = []
    if (isFileExist(GITMARS_REVERT_CACHE_FILE)) {
        reverts = require(GITMARS_REVERT_CACHE_FILE)
    } else {
        sh.touch(GITMARS_REVERT_CACHE_FILE)
        // sh.sed('-i', /[.\n]+/, '[]', GITMARS_REVERT_CACHE_FILE)
        writeFileSync(GITMARS_REVERT_CACHE_FILE, JSON.stringify([]))
    }
    return reverts
}

/**
 * 存储未执行脚本列表
 *
 * @param reverts - revert缓存列表
 */
function setRevertCache(reverts: Array<RevertCacheType>): void {
    sh.touch(GITMARS_REVERT_CACHE_FILE)
    writeFileSync(GITMARS_REVERT_CACHE_FILE, JSON.stringify(reverts, null, 4))
}

/**
 * 设置revert缓存
 *
 * @param revertCaches - revert缓存列表
 * @returns result - 执行结果
 */
function addRevertCache(
    revertCaches: RevertCacheType | RevertCacheType[]
): void {
    if (!Array.isArray(revertCaches)) revertCaches = [revertCaches]
    const _cacheList = getRevertCache()
    let len = revertCaches.length
    while (len--) {
        const _index = _cacheList.findIndex(
            (item: RevertCacheType) =>
                item.before['%H'] ===
                (revertCaches as RevertCacheType[])[len].before['%H']
        )
        if (_index === -1) {
            // 第一次revert
            _cacheList.push(revertCaches[len])
        } else {
            // revert后的第二次revert
            // reverts.splice(_index, 1)
        }
    }
    setRevertCache(_cacheList)
}

/**
 * 清除队列缓存
 */
function cleanRevertCache(): void {
    setRevertCache([])
}

module.exports = {
    getRevertCache,
    setRevertCache,
    addRevertCache,
    cleanRevertCache
}
export {}
