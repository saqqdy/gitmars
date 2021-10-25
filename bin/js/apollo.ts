const path = require('path')
const apollo = require('node-apollo')
const sh = require('shelljs')
sh.config.execPath = sh.which('node').toString()
const { error, writeFile } = require('./index')
const getConfig = require('./getConfig')

import type { ApolloConfigType, GitmarsConfigType } from '../../typings'

/**
 * apolloConfig
 * @description 读取构建配置
 * @returns {Object} arr 返回配置对象
 */
async function apolloConfig(): Promise<ApolloConfigType | void> {
    const cacheDir = path.join(__dirname, '../../cache')
    const now = new Date().getTime()
    let apolloConfig
    if (sh.test('-f', cacheDir + '/buildConfig.json')) {
        const fileDate: number = parseInt(
            sh.cat(cacheDir + '/buildConfig.txt').stdout
        )
        if (now - fileDate < 24 * 60 * 60 * 1000)
            return require(cacheDir + '/buildConfig.json')
    }
    const config = getConfig() as GitmarsConfigType
    if (!config.apolloConfig) {
        sh.echo(error('请配置apollo'))
        sh.exit(0)
        return
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
    await writeFile(cacheDir + '/buildConfig.txt', String(now))
    await writeFile(
        cacheDir + '/buildConfig.json',
        JSON.stringify(result.content)
    )
    return result.content
}

module.exports = apolloConfig
