const isFileExist = require('./isFileExist')
const gitRevParse = require('./gitRevParse')
const { root } = gitRevParse()
/**
 * getConfigFrom
 * @description 读取配置来源
 * @returns {Number} 返回来源0，1，2
 */
const getConfigFrom = (): 0 | 1 | 2 => {
    if (isFileExist(root + '/.gitmarsrc')) {
        return 1
    } else if (isFileExist(root + '/gitmarsconfig.json')) {
        return 2
    }
    return 0
}
module.exports = getConfigFrom()
export {}
