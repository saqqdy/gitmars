const sh = require('shelljs')
const { getApolloConfig } = require('./build/index')
const { error } = require('./utils/index')

import type { ApolloConfigType } from '../../typings'

export interface GroupMessageConfigType {
    silent?: boolean
    url?: string
}

/**
 * 发送群消息
 *
 * @param message - 消息
 * @param cfg - 配置
 */
async function sendGroupMessage(
    message: string,
    cfg: GroupMessageConfigType = {}
): Promise<void> {
    const config = (await getApolloConfig()) as ApolloConfigType
    const { silent = true, url } = cfg
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
    urls.forEach(() => {
        sh.exec(
            `curl -i -H "Content-Type: application/json" -X POST -d "{\u005c"content\u005c":\u005c"${message}\u005c"}" "${
                url || config.gitNotificationGroupUrl
            }"`,
            { silent }
        )
    })
}

module.exports = sendGroupMessage
export {}
