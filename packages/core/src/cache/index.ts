export { isCacheExpired, updateCacheTime, cleanCache } from '#lib/cache/cache'
export { setLog, cleanLog } from '#lib/cache/log'
export { getCommandCache, setCommandCache, cleanCommandCache } from '#lib/cache/commandCache'
export {
	getRevertCache,
	setRevertCache,
	addRevertCache,
	delRevertCache,
	cleanRevertCache
} from '#lib/cache/revertCache'
