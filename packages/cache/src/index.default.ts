import { CACHE_PATH } from './paths'
import { cleanCache, isCacheExpired, updateCacheTime } from './cache'
import { cleanLog, setLog } from './log'
import { cleanCommandCache, getCommandCache, setCommandCache } from './commandCache'
import {
	addRevertCache,
	cleanRevertCache,
	delRevertCache,
	getRevertCache,
	setRevertCache
} from './revertCache'
import { cleanPkgInfo, getPkgInfo } from './pkgInfo'

export type * from './types'
export default {
	version: '__VERSION__',
	CACHE_PATH,
	isCacheExpired,
	updateCacheTime,
	cleanCache,
	setLog,
	cleanLog,
	getCommandCache,
	setCommandCache,
	cleanCommandCache,
	getRevertCache,
	setRevertCache,
	addRevertCache,
	delRevertCache,
	cleanRevertCache,
	getPkgInfo,
	cleanPkgInfo
}
