const sh = require('shelljs')
const apolloConfig = require('./apollo')
const { error } = require('./index')

import type { ApolloConfigType } from '../../typings'

export interface GroupMessageConfigType {
    silent?: boolean
    url?: string
}

/**
 * sendGroupMessage
 * @description 发送群消息
 */
async function sendGroupMessage(message: string, cfg: GroupMessageConfigType = {}): Promise<void> {
    const config = (await apolloConfig()) as ApolloConfigType
    const { silent = true, url } = cfg
    let urls: string[] = []
    if (!config.gitNotificationGroupUrl && !url) {
        sh.echo(error('没有配置群消息推送地址'))
        return
    }
    if (url) urls = [url]
    else if (config.gitNotificationGroupUrl) {
        if (typeof config.gitNotificationGroupUrl === 'string') urls = [config.gitNotificationGroupUrl]
        else urls = config.gitNotificationGroupUrl
    }
    message = message.replace(/\s/g, '')
    urls.forEach(() => {
        sh.exec(`curl -i -H "Content-Type: application/json" -X POST -d "{\\"content\\":\\"${message}\\"}" "${url || config.gitNotificationGroupUrl}"`, { silent })
    })
}

module.exports = sendGroupMessage
