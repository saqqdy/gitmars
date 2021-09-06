/**
 * debug
 * @description debug
 */
function debug(...args) {
    if (['1', 'true'].includes(process.env.HUSKY_DEBUG || '')) {
        console.info('gitmars:debug', ...args)
    }
}

export { debug, debug as default }
