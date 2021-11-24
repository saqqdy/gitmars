const sh = require('shelljs')
const { getGitUser } = require('../git/getGitUser')
const { error } = require('../utils/colors')
const getConfig = require('../getConfig')

import { FetchDataType } from '../../../typings'

// 获取用户信息
function getUserToken(): FetchDataType {
    const config = getConfig()
    if (!config.api) {
        sh.echo(
            error(
                '请配置用于请求权限的api接口地址，接收参数形式：url?name=git_user_name，返回data=token'
            )
        )
        process.exit(1)
    }

    const user = getGitUser()
    if (!user) {
        sh.echo(error('请设置本地git用户名'))
        process.exit(1)
    }

    let fetchData: any = sh.exec(`curl -s ${config.api}?name=${user}`, {
            silent: true
        }).stdout,
        userInfo
    try {
        fetchData = JSON.parse(fetchData)
        userInfo = (fetchData.data as FetchDataType) || null
    } catch (err) {
        userInfo = null
    }

    // 没有查到用户信息或者没有设置token
    if (!userInfo) {
        sh.echo(error('没有找到用户，请联系管理员'))
        process.exit(1)
    } else if (!userInfo.token) {
        sh.echo(error('请设置access_token'))
        process.exit(1)
    }
    return userInfo
}

module.exports = getUserToken
