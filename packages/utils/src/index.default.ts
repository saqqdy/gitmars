import { createArgs } from './command'
import { debug, debugError, debugWarn, isDebug } from './debug'
import echo from './echo'
import { isFileExist, removeFile, writeFile, writeFileSync } from './file'
import getSeconds from './getSeconds'
import isWin32 from './isWin32'
import { useLocale } from './local'
import stringify from './stringify'
import { decodeUnicode, encodeUnicode } from './unicode'
import { spawn, spawnSync } from './spawn'

export { type GitmarsCacheFileDescriptionType } from './file'
export type { LocaleContext, Translator, TranslatorOption } from './local'
// export type * from './file'
// export type * from './local'
export type * from './types'
export default {
	version: '__VERSION__',
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
