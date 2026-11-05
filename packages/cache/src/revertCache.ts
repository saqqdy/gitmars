import type { RevertCacheType } from './types'
import { createRequire } from 'node:module'
import { getGitRevParse } from '@gitmars/git'
import { debug, isFileExist, writeFileSync } from '@gitmars/utils'
import sh from 'shelljs'

const require = createRequire(import.meta.url)
const { gitDir } = getGitRevParse()
const GITMARS_REVERT_CACHE_FILE = `${gitDir}/gitmarsreverts.json`

/**
 * Get the revert cache
 *
 * @param branch - Branch name
 * @returns reverts - List of revert cache entries
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
 * Store the revert cache
 *
 * @param reverts - List of revert cache entries
 */
export function setRevertCache(reverts: Array<RevertCacheType>): void {
	sh.touch(GITMARS_REVERT_CACHE_FILE)
	writeFileSync(GITMARS_REVERT_CACHE_FILE, JSON.stringify(reverts, null, 4))
}

/**
 * Add revert cache entries
 *
 * @param revertCaches - List of revert cache entries
 * @returns void
 */
export function addRevertCache(revertCaches: RevertCacheType | RevertCacheType[]): void {
	if (!Array.isArray(revertCaches)) revertCaches = [revertCaches]
	const _cacheList = getRevertCache()
	let len = revertCaches.length

	while (len--) {
		const _index = _cacheList.findIndex(
			(item: RevertCacheType) =>
				item.before['%H'] === (revertCaches as RevertCacheType[])[len].before['%H'],
		)

		if (_index === -1) {
			// First revert
			_cacheList.push(revertCaches[len])
		} else {
			// Second revert after the first one
			// reverts.splice(_index, 1)
		}
	}
	setRevertCache(_cacheList)
}

/**
 * Remove the revert cache
 */
export function delRevertCache(commitIDs: string | string[]): void {
	if (!Array.isArray(commitIDs)) commitIDs = [commitIDs]
	const _cacheList = getRevertCache()
	let len = commitIDs.length

	while (len--) {
		const _index = _cacheList.findIndex((item: RevertCacheType) =>
			item.after['%H']!.includes((commitIDs as string[])[len]),
		)

		if (_index > -1) {
			_cacheList.splice(_index, 1)
		}
	}
	setRevertCache(_cacheList)
}

/**
 * Clear the revert cache
 */
export function cleanRevertCache(): void {
	setRevertCache([])
}
