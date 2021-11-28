const sh = require('shelljs')
const getGitRevParse = require('../git/getGitRevParse')
const { writeFile, isFileExist } = require('../utils/file')

import type { GitLogType } from '../../../typings'

export interface RevertCacheType {
    before: GitLogType
    after: GitLogType
}

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
        sh.sed('-i', /.+/, '[]', GITMARS_REVERT_CACHE_FILE)
    }
    return reverts
}

/**
 * 存储未执行脚本列表
 *
 * @param reverts - revert缓存列表
 */
async function setRevertCache(reverts: Array<RevertCacheType>): Promise<void> {
    sh.touch(GITMARS_REVERT_CACHE_FILE)
    await writeFile(GITMARS_REVERT_CACHE_FILE, JSON.stringify(reverts))
}

/**
 * 设置revert缓存
 *
 * @param reverts - revert缓存列表
 */
async function addRevertCache(revert: GitLogType): Promise<void> {
    const reverts = getRevertCache()
    const _index = reverts.findIndex(
        (item: RevertCacheType) => item.after['%H'] === revert['%H']
    )
    if (_index === -1) {
        // 第一次revert
        reverts.push({ before: revert, after: revert })
    } else {
        // revert后的第二次revert
        reverts.splice(_index, 1)
    }
    await setRevertCache(reverts)
}

/**
 * 清除队列缓存
 */
async function cleanRevertCache(): Promise<void> {
    await setRevertCache([])
}

module.exports = {
    getRevertCache,
    setRevertCache,
    addRevertCache,
    cleanRevertCache
}
export {}
