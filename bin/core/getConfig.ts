const fs = require('fs')
const { cosmiconfigSync } = require('cosmiconfig')
const { getGitRevParse } = require('./git/index')
const { defaults } = require('./global')

import type { GitmarsConfigType } from 'typings'

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
        try {
            pathName = root + '/gitmarsconfig.json'
            info = fs.statSync(pathName)
        } catch (err) {
            pathName = root
        }
    }
    const defaultSet = {
        skipCI: true
    }
    const explorer = cosmiconfigSync(moduleName)
    if (!info) info = fs.statSync(pathName)
    if (info.isDirectory()) {
        // 传入目录
        const { config = {}, filepath = '' } = explorer.search(pathName) || {}
        return Object.assign({}, defaults, defaultSet, config, { filepath })
    } else {
        // 传入文件
        const { config = {}, filepath = '' } = explorer.load(pathName) || {}
        return Object.assign({}, defaults, defaultSet, config, { filepath })
    }
}

module.exports = getConfig
export {}
