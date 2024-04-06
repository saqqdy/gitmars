export { createArgs } from './command'
export { isDebug, debug, debugWarn, debugError } from './debug'
export { default as echo } from './echo'
export { writeFile, writeFileSync, isFileExist, removeFile } from './file'
export { default as getSeconds } from './getSeconds'
export { default as isWin32 } from './isWin32'
export { useLocale } from './local'
export { default as stringify } from './stringify'
export { encodeUnicode, decodeUnicode } from './unicode'
export { spawn, spawnSync } from './spawn'

export { default } from './index.default'
export type * from './index.default'
export const version = '__VERSION__' as string
