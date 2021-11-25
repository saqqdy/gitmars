const { isFileExist } = require('./utils/index')
const { getGitRevParse } = require('./git/index')
const { root } = getGitRevParse()
/**
 * 取配置来源
 *
 * @returns from - 返回来源0，1，2
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
