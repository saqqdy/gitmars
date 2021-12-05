const sh = require('shelljs')
const getGitRevParse = require('../git/getGitRevParse')
const { writeFileSync, isFileExist } = require('../utils/file')

import type { GitLogsType, RevertCacheType } from '../../../typings'

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
 * @param reverts - revert缓存列表
 * @returns result - 执行结果
 */
function addRevertCache(reverts: GitLogsType | GitLogsType[]): void {
    if (!Array.isArray(reverts)) reverts = [reverts]
    const revertCache = getRevertCache()
    let len = reverts.length
    while (len--) {
        const _index = revertCache.findIndex(
            (item: RevertCacheType) =>
                item.after['%H'] === (reverts as GitLogsType[])[len]['%H']
        )
        if (_index === -1) {
            // 第一次revert
            revertCache.push({ before: reverts[len], after: {} as GitLogsType })
        } else {
            // revert后的第二次revert
            // reverts.splice(_index, 1)
        }
    }
    setRevertCache(revertCache)
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
