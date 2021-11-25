const { isCacheExpired, updateCacheTime } = require('./cache')
const {
    getCommandCache,
    setCommandCache,
    cleanCommandCache
} = require('./commandCache')
const { setLog } = require('./log')

module.exports = {
    isCacheExpired,
    updateCacheTime,
    getCommandCache,
    setCommandCache,
    cleanCommandCache,
    setLog
}
export {}
