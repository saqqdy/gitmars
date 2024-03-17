import sh from 'shelljs'
import chalk from 'chalk'
import { spawnSync } from '@gitmars/core'
import { debug } from '@gitmars/utils'
import lang from './lang'

const { t } = lang

/**
 * Get the list of staging areas
 *
 * @param key - name
 * @returns stashList - return stashList
 */
function getStashList(key: string) {
	const { stdout } = spawnSync('git', [
		'stash',
		'list'
		// '--name-only',
		// '--pretty=format:%gd'
	])
	const list: string[] = (stdout && stdout.split('\n')) || []
	const arr: {
		key: string
		index: number
		msg: string
	}[] = []
	if (list.length > 10) {
		sh.echo(
			chalk.yellow(
				t(
					'There are a total of {length} staging records under this item, please clean it up regularly!',
					{ length: String(list.length) }
				)
			)
		)
	}
	try {
		list.forEach(item => {
			const msgArr: string[] = item.replace(/\s?:\s?/g, ':').split(':')
			const first = msgArr.shift() as string
			if (!key || (key && msgArr[msgArr.length - 1].includes(key))) {
				const m = first.match(/^stash@\{(\d+)\}$/)
				// Removing unnecessary messages
				if (msgArr.length > 1) msgArr.shift()
				arr.push({
					key: first,
					index: m ? +m[1] : 0,
					msg: msgArr.join(':').trim()
				})
			}
		})
	} catch {
		//
	}
	debug('getStashList', arr, list)
	return arr
}

export default getStashList
