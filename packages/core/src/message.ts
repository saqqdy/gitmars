import sh from 'shelljs'
import chalk from 'chalk'
import { mapTemplate } from 'js-cool'
import { getConfig, getGitConfig, getGitRevParse } from '@gitmars/git'
import sendGroupMessage from './sendGroupMessage'
import lang from './lang'

const { t } = lang

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
		sh.echo(chalk.red(t('Please configure the message sending api template address')))
		return
	}
	const message = mapTemplate(config.msgTemplate, (key: string) => {
		if (key === 'message') return msg
		return getMessage(key)
	})
	message && (await sendGroupMessage(message))
}
