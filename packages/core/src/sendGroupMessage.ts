import sh from 'shelljs'
import chalk from 'chalk'
import request from '@jssj/request'
import type { ApolloConfigType } from '../typings'
import { getBuildConfig } from './build/buildConfig'

/**
 * 发送群消息
 *
 * @param message - 消息
 * @param cfg - 配置
 */
async function sendGroupMessage(message: string, url = ''): Promise<void> {
    let urls: string[] = [],
        config: ApolloConfigType
    if (url) urls = url.split(',')
    else {
        // 没有传入url，从配置中取
        config = (await getBuildConfig()) as ApolloConfigType
        if (config.gitNotificationGroupUrl) {
            urls = urls.concat(config.gitNotificationGroupUrl)
        }
    }
    if (urls.length === 0) {
        sh.echo(chalk.red('没有配置群消息推送地址'))
        return
    }
    message = message.replace(/\s/g, '')
    urls.forEach(async item => {
        await request
            .post({
                url: item,
                data: {
                    content: message
                },
                headers: { 'Content-Type': 'application/json' }
            })
            .then(() => {
                sh.echo(chalk.green('发送消息成功'))
            })
    })
}

export default sendGroupMessage
