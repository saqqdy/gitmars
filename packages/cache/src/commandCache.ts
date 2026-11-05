import type { CommandType } from './types'
import { getGitRevParse } from '@gitmars/git'
import { isFileExist } from '@gitmars/utils'
import sh from 'shelljs'

/**
 * Get the list of pending scripts
 *
 * @returns arr - List of commands to execute
 */
export function getCommandCache() {
	const { gitDir } = getGitRevParse()
	let arr: string[] = []

	if (isFileExist(`${gitDir}/.gitmarscommands`)) {
		const result = sh
			.cat(`${gitDir}/.gitmarscommands`)
			.stdout.split('\n')[0]
			.replace(/(^\n*)|(\n*$)/g, '')
			.replace(/\n{2,}/g, '\n')
			.replace(/\r/g, '')

		arr = JSON.parse(decodeURIComponent(result))
	}

	return arr
}

/**
 * Store the list of pending scripts
 *
 * @param rest - List of commands to execute
 */
export function setCommandCache(rest: Array<CommandType | string | string[]>): void {
	const { gitDir } = getGitRevParse()

	sh.touch(`${gitDir}/.gitmarscommands`)
	sh.sed(
		'-i',

		/[\s\S]*/,
		encodeURIComponent(JSON.stringify(rest)),
		`${gitDir}/.gitmarscommands`,
	)
}

/**
 * Clear the queue cache
 */
export function cleanCommandCache(): void {
	setCommandCache([])
}
