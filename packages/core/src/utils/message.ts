import sh from 'shelljs'
import request from '@jssj/request'
import chalk from 'chalk'
import getGitConfig from '#lib/git/getGitConfig'
import getGitRevParse from '#lib/git/getGitRevParse'
import getConfig from '#lib/getConfig'
import mapTemplate from '#lib/utils/mapTemplate'

/**
 * 解析模板数据
 *
 * @param type - 类型
 * @returns message - 数据
 */
export function getMessage(type: string): string {
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
            str = config.user!
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
export async function postMessage(msg = ''): Promise<void> {
    const config = getConfig()
    if (!config.msgTemplate) {
        sh.echo(chalk.red('请配置消息发送api模板地址'))
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
export async function sendMessage(message = ''): Promise<void> {
    const config = getConfig()
    if (!config.msgUrl) {
        sh.echo(chalk.red('请配置消息推送地址'))
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
                sh.echo(chalk.green('发送消息成功'))
            })
    }
}

export default {
    getMessage,
    postMessage,
    sendMessage
}
