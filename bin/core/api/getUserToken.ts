const sh = require('shelljs')
const { red } = require('colors')
const { getGitUser } = require('../git/getGitUser')
const request = require('@jssj/request')
const getConfig = require('../getConfig')
const { debug } = require('../utils/debug')

import { FetchDataType } from '../../../typings'

// 获取用户信息
async function getUserToken(): Promise<FetchDataType> {
    const config = getConfig()
    if (!config.api) {
        sh.echo(
            red(
                '请配置用于请求权限的api接口地址，接收参数形式：url?name=git_user_name，返回data=token'
            )
        )
        process.exit(1)
    }

    const user = getGitUser()
    if (!user) {
        sh.echo(red('请设置本地git用户名'))
        process.exit(1)
    }

    const fetchData =
        ((await request.get({ url: `${config.api}?name=${user}` }))
            .data as FetchDataType) || null
    debug('getUserToken-user', user, config.api)
    debug('getUserToken-fetchData', fetchData)
    // 没有查到用户信息或者没有设置token
    if (!fetchData) {
        sh.echo(red('没有找到用户，请联系管理员'))
        process.exit(1)
    } else if (!fetchData.token) {
        sh.echo(red('请设置access_token'))
        process.exit(1)
    }
    return fetchData
}

module.exports = getUserToken
export {}
