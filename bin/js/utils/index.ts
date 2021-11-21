const { warning, error, success } = require('./colors')
const { writeFile, isFileExist } = require('./file')
const { isCacheExpired, updateCacheTime } = require('./cache')

module.exports = {
    warning,
    error,
    success,

    writeFile,
    isFileExist,

    isCacheExpired,
    updateCacheTime
}
