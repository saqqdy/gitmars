const sh = require('shelljs')
const request = require('./request')
const getApolloConfig = require('./build/getApolloConfig')
const { error, success } = require('./utils/colors')

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
        sh.echo(error('没有配置群消息推送地址'))
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
                sh.echo(success('发送消息成功'))
            })
        // sh.exec(
        //     `curl -i -H "Content-Type: application/json" -X POST -d "{\u005c"content\u005c":\u005c"${message}\u005c"}" "${
        //         item || config.gitNotificationGroupUrl
        //     }"`,
        //     { silent }
        // )
    })
}

module.exports = sendGroupMessage
export {}
