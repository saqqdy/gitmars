/**
 * debug
 */
function debug(...args: any[]) {
    if (['1', 'true'].includes(process.env.HUSKY_DEBUG || '')) {
        console.info('gitmars:debug', ...args)
    }
}

module.exports = debug
export {}
