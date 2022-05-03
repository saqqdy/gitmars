import path from 'path'
import apollo from 'node-apollo'
import sh from 'shelljs'
import request from '@jssj/request'
import { red } from 'colors'
import type {
    ApolloConfigType,
    GitmarsConfigApisBuildConfigType,
    GitmarsConfigType
} from '../../typings'
import { isFileExist, writeFile } from '../utils/file'
import { isCacheExpired, updateCacheTime } from '../cache/cache'
import getConfig from '../getConfig'
import { debug } from '../utils/debug'

/**
 * 获取namespace
 *
 * @param params - GitmarsConfigApisBuildConfigType['params']
 * @returns string - namespace
 */
function getNamespace(
    params: GitmarsConfigApisBuildConfigType['params'] = {}
): string {
    const names = []
    const keys = Object.keys(params).sort((a, b) => a.length - b.length)
    for (const key of keys) {
        if (params[key] && typeof params[key] === 'string') {
            names.push(params[key])
        }
    }
    if (names.length) return names.join('-')
    return 'gitmars'
}

/**
 * 读取构建配置
 *
 * @returns buildConfig - 返回配置对象
 */
async function getBuildConfig(): Promise<ApolloConfigType | void> {
    const cacheDir = path.join(__dirname, '../../../cache')
    const config = getConfig() as GitmarsConfigType
    const { apis = {} } = config
    let NS, _buildConfig
    debug('getBuildConfig', config)

    if (apis.buildConfig) {
        NS = getNamespace(apis.buildConfig.params || {})
    } else if (config.apolloConfig) {
        const { appId, clusterName } = config.apolloConfig
        NS = getNamespace({ appId, clusterName })
    } else {
        sh.echo(red('请配置apollo或buildConfigApi'))
        process.exit(0)
        return
    }

    const BUILD_CONFIG_TIME_NAME = `buildConfigTime-${NS}`
    const BUILD_CONFIG_PATH = `${cacheDir}/buildConfig-${NS}.json`
    // 有配置文件且没有过期，返回配置
    if (
        !isCacheExpired(BUILD_CONFIG_TIME_NAME) &&
        isFileExist(BUILD_CONFIG_PATH)
    ) {
        return require(BUILD_CONFIG_PATH)
    }

    if (apis.buildConfig) {
        // 优先使用api获取配置
        const { url, method = 'get', params = {} } = apis.buildConfig
        _buildConfig =
            (
                await request[method]({
                    url,
                    data: params
                })
            ).data || {}
    } else if (config.apolloConfig) {
        let apolloConfig
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
        _buildConfig =
            (await apollo.remoteConfigService(apolloConfig)).content || {}
    }

    await updateCacheTime(BUILD_CONFIG_TIME_NAME)
    await writeFile(BUILD_CONFIG_PATH, JSON.stringify(_buildConfig))
    return _buildConfig
}

export default getBuildConfig
