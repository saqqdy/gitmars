export const isDebug = ['1', 'true'].includes(process.env.GITMARS_DEBUG || '')

/**
 * debug
 *
 * @param args - Parameters
 */
export function debug(...args: any[]) {
    if (isDebug) {
        console.info('gitmars:debug', ...args)
    }
}

export default {
    isDebug,
    debug
}
