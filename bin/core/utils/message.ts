const sh = require('shelljs')
const request = require('../request')
const { error, success } = require('./colors')
const mapTemplate = require('./mapTemplate')
const getGitConfig = require('../git/getGitConfig')
const getGitRevParse = require('../git/getGitRevParse')
const getConfig = require('../getConfig')

export type SendMessageType = {
    silent: boolean
}

/**
 * 解析模板数据
 *
 * @param type - 类型
 * @returns message - 数据
 */
function getMessage(type: string): string {
    const { root } = getGitRevParse()
    const { appName } = getGitConfig()
    const config = getConfig()
    const d = new Date()
    let str = ''
    switch (type) {
        case 'time':
            str = d.toLocaleString()
            break
        case 'timeNum':
            str = String(d.getTime())
            break
        case 'pwd':
            str = root
            break
        case 'project':
            str = appName
            break
        case 'user':
            str = config.user
            break

        default:
            break
    }
    return str
}

/**
 * 发送消息
 *
 * @param msg - 消息
 */
function postMessage(msg = ''): void {
    const config = getConfig()
    if (!config.msgTemplate) {
        sh.echo(error('请配置消息发送api模板地址'))
        return
    }
    const message = mapTemplate(config.msgTemplate, (key: string) => {
        if (key === 'message') return msg
        return getMessage(key)
    })
    config.msgUrl && message && sendMessage(message)
}

/**
 * 发送消息
 *
 * @param message - 消息
 * @param cfg - 配置 SendMessageType
 */
async function sendMessage(
    message = '',
    cfg = {} as SendMessageType
): Promise<void> {
    const config = getConfig()
    const { silent = true } = cfg
    if (!config.msgUrl) {
        sh.echo(error('请配置消息推送地址'))
        return
    }
    message = message.replace(/\s/g, '')
    // if (config.msgUrl) {
    //     await request
    //         .post(
    //             {
    //                 url: config.msgUrl
    //             },
    //             {
    //                 envParams: {
    //                     error_msg: message
    //                 }
    //             }
    //         )
    //         .then(() => {
    //             sh.echo(success('发送消息成功'))
    //         })
    // }
    config.msgUrl &&
        sh.exec(
            `curl -i -H "Content-Type: application/json" -X POST -d '{"envParams":{"error_msg":"'${message}'"}}' "${config.msgUrl}"`,
            { silent }
        )
}

module.exports = {
    getMessage,
    postMessage,
    sendMessage
}
export {}
