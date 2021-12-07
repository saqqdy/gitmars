const path = require('path')
const apollo = require('node-apollo')
const sh = require('shelljs')
const { red } = require('colors')
const { writeFile, isFileExist } = require('../utils/file')
const { isCacheExpired, updateCacheTime } = require('../cache/cache')
const getConfig = require('../getConfig')

import type { ApolloConfigType, GitmarsConfigType } from '../../../typings'

/**
 * 读取构建配置
 *
 * @returns apolloConfig - 返回配置对象
 */
async function getApolloConfig(): Promise<ApolloConfigType | void> {
    const cacheDir = path.join(__dirname, '../../../cache')
    const config = getConfig() as GitmarsConfigType
    if (!config.apolloConfig) {
        sh.echo(red('请配置apollo'))
        process.exit(0)
        return
    }
    const { appId, clusterName } = config.apolloConfig
    const BUILD_CONFIG_TIME_NAME = `buildConfigTime-${appId}-${clusterName}`
    const BUILD_CONFIG_PATH = `${cacheDir}/buildConfig-${appId}-${clusterName}.json`
    let apolloConfig
    // 有配置文件且没有过期，返回配置
    if (
        !isCacheExpired(BUILD_CONFIG_TIME_NAME) &&
        isFileExist(BUILD_CONFIG_PATH)
    ) {
        return require(BUILD_CONFIG_PATH)
    }
    // 如果传入的是json字符串，转json
    if (typeof config.apolloConfig === 'string') {
        try {
            apolloConfig = JSON.parse(config.apolloConfig)
        } catch {
            return
        }
    } else {
        apolloConfig = config.apolloConfig
    }
    const result = await apollo.remoteConfigService(apolloConfig)
    await updateCacheTime(BUILD_CONFIG_TIME_NAME)
    await writeFile(BUILD_CONFIG_PATH, JSON.stringify(result.content))
    return result.content
}

module.exports = getApolloConfig
export {}
