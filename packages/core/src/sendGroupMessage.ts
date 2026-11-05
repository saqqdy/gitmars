import type { ApolloConfigType } from '@gitmars/build'
import { getBuildConfig } from '@gitmars/build'
import request from '@jssj/request'
import chalk from 'chalk'
import sh from 'shelljs'
import lang from './lang'

const { t } = lang

/**
 * Send a group message
 *
 * @param message - Message
 * @param cfg - Configuration
 */
async function sendGroupMessage(message: string, url = ''): Promise<void> {
	let urls: string[] = [],
		config: ApolloConfigType

	if (url) urls = url.split(',')
	else {
		// Fall back to the configured URL when none is passed
		config = (await getBuildConfig()) as ApolloConfigType
		if (config.gitNotificationGroupUrl) {
			urls = urls.concat(config.gitNotificationGroupUrl)
		}
	}
	if (urls.length === 0) {
		sh.echo(chalk.red(t('No group message push address configured')))

		return
	}
	urls.forEach(async item => {
		await request
			.post({
				url: item,
				data: {
					content: message,
				},
				headers: { 'Content-Type': 'application/json' },
			})
			.then(() => {
				sh.echo(chalk.green(t('Message sent successfully')))
			})
	})
}

export default sendGroupMessage
