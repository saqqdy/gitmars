const { warning, error, success } = require('./colors')
const { writeFile, isFileExist } = require('./file')
const { isCacheExpired, updateCacheTime } = require('./cache')
const { createArgs } = require('./command')
const getSeconds = require('./getSeconds')

module.exports = {
    warning,
    error,
    success,
    writeFile,
    isFileExist,
    isCacheExpired,
    updateCacheTime,
    createArgs,
    getSeconds
}
