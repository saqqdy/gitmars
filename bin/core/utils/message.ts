const sh = require('shelljs')
const request = require('@jssj/request')
const { green, red } = require('colors')
const mapTemplate = require('./mapTemplate')
const getGitConfig = require('../git/getGitConfig')
const getGitRevParse = require('../git/getGitRevParse')
const getConfig = require('../getConfig')

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
async function postMessage(msg = ''): Promise<void> {
    const config = getConfig()
    if (!config.msgTemplate) {
        sh.echo(red('请配置消息发送api模板地址'))
        return
    }
    const message = mapTemplate(config.msgTemplate, (key: string) => {
        if (key === 'message') return msg
        return getMessage(key)
    })
    config.msgUrl && message && (await sendMessage(message))
}

/**
 * 发送消息
 *
 * @param message - 消息
 * @param cfg - 配置 SendMessageType
 */
async function sendMessage(message = ''): Promise<void> {
    const config = getConfig()
    if (!config.msgUrl) {
        sh.echo(red('请配置消息推送地址'))
        return
    }
    message = message.replace(/\s/g, '')
    if (config.msgUrl) {
        await request
            .post({
                url: config.msgUrl,
                data: {
                    envParams: {
                        error_msg: message
                    }
                },
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            })
            .then(() => {
                sh.echo(green('发送消息成功'))
            })
    }
}

module.exports = {
    getMessage,
    postMessage,
    sendMessage
}
export {}
