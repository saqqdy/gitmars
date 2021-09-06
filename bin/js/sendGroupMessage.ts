import sh from 'shelljs'
import apolloConfig from './apollo'

/**
 * sendGroupMessage
 * @description 发送群消息
 */
async function sendGroupMessage(message, cfg = {}) {
    const config = await apolloConfig()
    const { silent = true, url } = cfg
    let urls
    if (!config.gitNotificationGroupUrl && !url) {
        sh.echo(error('没有配置群消息推送地址'))
        return
    }
    urls = [].concat(config.gitNotificationGroupUrl)
    message = message.replace(/\s/g, '')
    urls.forEach(() => {
        sh.exec(`curl -i -H "Content-Type: application/json" -X POST -d "{\\"content\\":\\"${message}\\"}" "${url || config.gitNotificationGroupUrl}"`, { silent })
    })
}

export default sendGroupMessage
