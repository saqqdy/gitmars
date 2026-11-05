import { getConfig, getGitConfig, getGitRevParse } from '@gitmars/git'
import chalk from 'chalk'
import { mapTemplate } from 'js-cool'
import sh from 'shelljs'
import lang from './lang'
import sendGroupMessage from './sendGroupMessage'

const { t } = lang

/**
 * Parse template data
 *
 * @param type - Type
 * @returns message - The parsed data
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
 * Send a message
 *
 * @param msg - Message
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
