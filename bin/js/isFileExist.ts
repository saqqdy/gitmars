const sh = require('shelljs')

/**
 * 判断文件是否存在
 *
 * @param filePath - 完整文件路径
 * @returns isFileExist - 返回是否
 */
function isFileExist(filePath: string): boolean {
    // 这里使用find是为了兼容路径里面带了通配符
    return sh.test('-f', filePath) || sh.find(filePath).stdout !== ''
}

module.exports = isFileExist
