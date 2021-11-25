const sh = require('shelljs')
const getGitRevParse = require('../git/getGitRevParse')
const { isFileExist } = require('../utils/file')

import type { CommandType } from '../../../typings'

/**
 * 获取未执行脚本列表
 *
 * @returns arr - 待执行指令列表
 */
function getCommandCache() {
    const { gitDir } = getGitRevParse()
    let arr = []
    if (isFileExist(gitDir + '/.gitmarscommands')) {
        arr = sh
            .cat(gitDir + '/.gitmarscommands')
            .stdout.split('\n')[0]
            .replace(/(^\n*)|(\n*$)/g, '')
            .replace(/\n{2,}/g, '\n')
            .replace(/\r/g, '')
        arr = JSON.parse(decodeURIComponent(arr))
    }
    return arr
}

/**
 * 存储未执行脚本列表
 *
 * @param rest - 待执行指令列表
 */
function setCommandCache(rest: Array<CommandType | string>): void {
    const { gitDir } = getGitRevParse()
    sh.touch(gitDir + '/.gitmarscommands')
    sh.sed(
        '-i',
        // eslint-disable-next-line no-control-regex
        /[\s\S\n\r\x0a\x0d]*/,
        encodeURIComponent(JSON.stringify(rest)),
        gitDir + '/.gitmarscommands'
    )
}

/**
 * 清除队列缓存
 */
function cleanCommandCache(): void {
    setCommandCache([])
}

module.exports = {
    getCommandCache,
    setCommandCache,
    cleanCommandCache
}
export {}
