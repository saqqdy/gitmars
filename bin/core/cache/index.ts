const { isCacheExpired, updateCacheTime } = require('./cache')
const {
    getCommandCache,
    setCommandCache,
    cleanCommandCache
} = require('./commandCache')

module.exports = {
    isCacheExpired,
    updateCacheTime,
    getCommandCache,
    setCommandCache,
    cleanCommandCache
}
export {}
