import { createArgs } from './command'
import { debug, debugError, debugWarn, isDebug } from './debug'
import echo from './echo'
import { isFileExist, removeFile, writeFile, writeFileSync } from './file'
import getSeconds from './getSeconds'
import isWin32 from './isWin32'
import useLocale from './lang'
import { getMessage, postMessage } from './message'
import { CACHE_PATH, ROOT_PATH, SH_PATH, SRC_PATH } from './paths'
import { cleanPkgInfo, getPkgInfo } from './pkgInfo'
import stringify from './stringify'
import { decodeUnicode, encodeUnicode } from './unicode'

export default {
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
	getMessage,
	postMessage,
	ROOT_PATH,
	SRC_PATH,
	CACHE_PATH,
	SH_PATH,
	getPkgInfo,
	cleanPkgInfo,
	stringify,
	encodeUnicode,
	decodeUnicode
}
