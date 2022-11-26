import sh from 'shelljs'
import chalk from 'chalk'
import request from '@jssj/request'
import type { FetchDataType } from '../../typings'
import getConfig from '#lib/getConfig'
import { debug } from '#lib/utils/debug'
import { getGitUser } from '#lib/git/getGitUser'
import lang from '#lib/lang'

const { t } = lang

// 获取用户信息
async function getUserToken(): Promise<FetchDataType> {
    const config = getConfig()
    const userInfoApi =
        (config.apis && config.apis.userInfo && config.apis.userInfo.url) || config.api
    if (!userInfoApi) {
        sh.echo(
            chalk.red(
                t(
                    'Please configure the address of the api interface used to request permissions, receive parameters in the form: url?name=git_user_name, return data=token'
                )
            )
        )
        process.exit(1)
    }

    const user = getGitUser()
    if (!user) {
        sh.echo(chalk.red(t('Please set the local git user name')))
        process.exit(1)
    }

    const fetchData =
        ((await request.get({ url: `${userInfoApi}?name=${user}` })).data as FetchDataType) || null
    debug('getUserToken-user', user, userInfoApi)
    debug('getUserToken-fetchData', fetchData)
    // 没有查到用户信息或者没有设置token
    if (!fetchData) {
        sh.echo(chalk.red(t('No user found, please contact admin')))
        process.exit(1)
    } else if (!fetchData.token) {
        sh.echo(chalk.red(t('Please set access_token')))
        process.exit(1)
    }
    return fetchData
}

export default getUserToken
