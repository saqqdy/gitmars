import { statSync } from 'fs'
import { cosmiconfigSync } from 'cosmiconfig'
import type { GitmarsConfigType } from '../typings'
import getGitRevParse from './git/getGitRevParse'
import { defaults } from './global'
import { debug } from './utils/debug'
import echo from './utils/echo'

/**
 * 读取配置
 *
 * @param pathName - 可传入目录或者文件，传入文件时，直接读取文件
 * @param moduleName - 包名称
 * @returns config - 返回配置对象
 */
function getConfig(
    pathName?: string,
    moduleName = 'gitmars'
): GitmarsConfigType {
    let info
    if (!pathName) {
        const { root } = getGitRevParse()
        if (!root) {
            echo('当前目录不是git项目目录')
            process.exit(1)
        }
        try {
            pathName = root + '/gitmarsconfig.json'
            info = statSync(pathName)
        } catch (err) {
            pathName = root
        }
    }
    debug('getConfig', pathName, info)
    const defaultSet = {
        skipCI: true
    }
    const explorer = cosmiconfigSync(moduleName)
    if (!info) info = statSync(pathName)
    if (info.isDirectory()) {
        // 传入目录
        const { config = {}, filepath = '' } = explorer.search(pathName) || {}
        debug('getConfig-config', config, filepath)
        return Object.assign({}, defaults, defaultSet, config, { filepath })
    } else {
        // 传入文件
        const { config = {}, filepath = '' } = explorer.load(pathName) || {}
        debug('getConfig-config', config, filepath)
        return Object.assign({}, defaults, defaultSet, config, { filepath })
    }
}

export default getConfig
