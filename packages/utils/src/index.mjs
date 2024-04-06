import index from './index.cjs.js'

const {
	version,
	createArgs,
	isDebug,
	debug,
	debugWarn,
	debugError,
	echo,
	writeFile,
	writeFileSync,
	isFileExist,
	removeFile,
	getSeconds,
	isWin32,
	useLocale,
	stringify,
	encodeUnicode,
	decodeUnicode,
	spawn,
	spawnSync
} = index

export {
	index as default,
	version,
	createArgs,
	isDebug,
	debug,
	debugWarn,
	debugError,
	echo,
	writeFile,
	writeFileSync,
	isFileExist,
	removeFile,
	getSeconds,
	isWin32,
	useLocale,
	stringify,
	encodeUnicode,
	decodeUnicode,
	spawn,
	spawnSync
}
