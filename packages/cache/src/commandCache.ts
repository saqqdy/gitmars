import type { CommandType } from './types'
import { getGitRevParse } from '@gitmars/git'
import { isFileExist } from '@gitmars/utils'
import sh from 'shelljs'

/**
 * 获取未执行脚本列表
 *
 * @returns arr - 待执行指令列表
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
 * 存储未执行脚本列表
 *
 * @param rest - 待执行指令列表
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
 * 清除队列缓存
 */
export function cleanCommandCache(): void {
	setCommandCache([])
}
