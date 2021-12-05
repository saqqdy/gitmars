const sh = require('shelljs')
const { green, red } = require('colors')
const request = require('./request')
const getApolloConfig = require('./build/getApolloConfig')

import type { ApolloConfigType } from '../../typings'

/**
 * 发送群消息
 *
 * @param message - 消息
 * @param cfg - 配置
 */
async function sendGroupMessage(message: string, url = ''): Promise<void> {
    const config = (await getApolloConfig()) as ApolloConfigType
    let urls: string[] = []
    if (!config.gitNotificationGroupUrl && !url) {
        sh.echo(red('没有配置群消息推送地址'))
        return
    }
    if (url) urls = [url]
    else if (config.gitNotificationGroupUrl) {
        if (typeof config.gitNotificationGroupUrl === 'string')
            urls = [config.gitNotificationGroupUrl]
        else urls = config.gitNotificationGroupUrl
    }
    message = message.replace(/\s/g, '')
    urls.forEach(async item => {
        await request
            .post({
                url: item || config.gitNotificationGroupUrl,
                data: {
                    content: message
                },
                headers: { 'Content-Type': 'application/json' }
            })
            .then(() => {
                sh.echo(green('发送消息成功'))
            })
    })
}

module.exports = sendGroupMessage
export {}
