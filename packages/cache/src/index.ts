export { isCacheExpired, updateCacheTime, cleanCache } from './cache'
export { getCommandCache, setCommandCache, cleanCommandCache } from './commandCache'
export { default } from './index.default'
export type * from './index.default'
export { setLog, cleanLog } from './log'
export { CACHE_PATH } from './paths'

export { getPkgInfo, cleanPkgInfo } from './pkgInfo'
export {
	getRevertCache,
	setRevertCache,
	addRevertCache,
	delRevertCache,
	cleanRevertCache,
} from './revertCache'
export const version = '__VERSION__' as string
