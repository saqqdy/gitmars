const { warning, error, success } = require('./colors')
const { writeFile, isFileExist } = require('./file')
const { createArgs } = require('./command')
const getSeconds = require('./getSeconds')
const delay = require('./delay')
const { encodeUnicode, decodeUnicode } = require('./unicode')
const getPkgInfo = require('./getPkgInfo')
const readPkg = require('./readPkg')
const compareVersion = require('./compareVersion')
const mapTemplate = require('./mapTemplate')
const { getMessage, postMessage, sendMessage } = require('./message')
const echo = require('./echo')

module.exports = {
    warning,
    error,
    success,
    writeFile,
    isFileExist,
    createArgs,
    getSeconds,
    delay,
    encodeUnicode,
    decodeUnicode,
    getPkgInfo,
    readPkg,
    compareVersion,
    mapTemplate,
    getMessage,
    postMessage,
    sendMessage,
    echo
}
export {}
