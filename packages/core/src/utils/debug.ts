import chalk from 'chalk'
import _debug from 'debug'

const { red, yellow, green } = chalk
const name = '@gitmars/core'

export const isDebug = ['1', 'true'].includes(process.env.GITMARS_DEBUG || '') || process.env.DEBUG

/**
 * debug
 *
 * @param infoName - string
 * @param args - Parameters
 */
export function debug(infoName = '', ...args: any[]) {
    if (isDebug) {
        _debug(`${name}:info`)(`[${green(infoName)}]`, ...args)
    }
}

/**
 * debug warning
 *
 * @param infoName - string
 * @param args - Parameters
 */
export function debugWarn(infoName = '', ...args: any[]) {
    if (isDebug) {
        _debug(`${name}:warn`)(`[${yellow(infoName)}]`, ...args)
    }
}

/**
 * debug error
 *
 * @param infoName - string
 * @param args - Parameters
 */
export function debugError(infoName = '', ...args: any[]) {
    if (isDebug) {
        _debug(`${name}:error`)(`[${red(infoName)}]`, ...args)
    }
}

export default {
    isDebug,
    debug,
    debugWarn,
    debugError
}
