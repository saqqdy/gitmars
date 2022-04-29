const isDebug = ['1', 'true'].includes(process.env.GITMARS_DEBUG || '')

/**
 * debug
 *
 * @param args - 参数
 */
function debug(...args: any[]) {
    if (isDebug) {
        console.info('gitmars:debug', ...args)
    }
}

module.exports = {
    isDebug,
    debug
}
export {}
