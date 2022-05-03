import sh from 'shelljs'
import type { RevertCacheType } from '../../typings'
import getGitRevParse from '../git/getGitRevParse'
import { isFileExist, writeFileSync } from '../utils/file'
import { debug } from '../utils/debug'

const { gitDir } = getGitRevParse()
const GITMARS_REVERT_CACHE_FILE = gitDir + '/gitmarsreverts.json'

/**
 * 获取revert缓存
 *
 * @param branch - 分支名
 * @returns reverts - revert缓存列表
 */
export function getRevertCache(branch?: string) {
    let reverts: RevertCacheType[] = []
    if (isFileExist(GITMARS_REVERT_CACHE_FILE)) {
        reverts = require(GITMARS_REVERT_CACHE_FILE)
    } else {
        sh.touch(GITMARS_REVERT_CACHE_FILE)
        // sh.sed('-i', /[.\n]+/, '[]', GITMARS_REVERT_CACHE_FILE)
        writeFileSync(GITMARS_REVERT_CACHE_FILE, JSON.stringify([]))
    }
    debug('getRevertCache', reverts, branch)
    if (branch) reverts = reverts.filter(revert => revert.branch === branch)
    return reverts
}

/**
 * 存储未执行脚本列表
 *
 * @param reverts - revert缓存列表
 */
export function setRevertCache(reverts: Array<RevertCacheType>): void {
    sh.touch(GITMARS_REVERT_CACHE_FILE)
    writeFileSync(GITMARS_REVERT_CACHE_FILE, JSON.stringify(reverts, null, 4))
}

/**
 * 设置revert缓存
 *
 * @param revertCaches - revert缓存列表
 * @returns result - 执行结果
 */
export function addRevertCache(
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
 * 移除缓存
 */
export function delRevertCache(commitIDs: string | string[]): void {
    if (!Array.isArray(commitIDs)) commitIDs = [commitIDs]
    const _cacheList = getRevertCache()
    let len = commitIDs.length
    while (len--) {
        const _index = _cacheList.findIndex((item: RevertCacheType) =>
            item.after['%H']!.includes((commitIDs as string[])[len])
        )
        if (_index > -1) {
            _cacheList.splice(_index, 1)
        }
    }
    setRevertCache(_cacheList)
}

/**
 * 清除队列缓存
 */
export function cleanRevertCache(): void {
    setRevertCache([])
}

export default {
    getRevertCache,
    setRevertCache,
    addRevertCache,
    delRevertCache,
    cleanRevertCache
}
