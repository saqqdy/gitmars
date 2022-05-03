import sh from 'shelljs'
import type { CommandType } from '../../typings'
import getGitRevParse from '../git/getGitRevParse'
import { isFileExist } from '../utils/file'

/**
 * 获取未执行脚本列表
 *
 * @returns arr - 待执行指令列表
 */
export function getCommandCache() {
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
export function setCommandCache(rest: Array<CommandType | string>): void {
    const { gitDir } = getGitRevParse()
    sh.touch(gitDir + '/.gitmarscommands')
    sh.sed(
        '-i',
        // eslint-disable-next-line no-control-regex
        /[\s\S\n\r\x0A\x0D]*/,
        encodeURIComponent(JSON.stringify(rest)),
        gitDir + '/.gitmarscommands'
    )
}

/**
 * 清除队列缓存
 */
export function cleanCommandCache(): void {
    setCommandCache([])
}

export default {
    getCommandCache,
    setCommandCache,
    cleanCommandCache
}
