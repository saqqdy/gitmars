import type { GitmarsLogType } from './types'
import { getGitRevParse } from '@gitmars/git'
import { removeFile } from '@gitmars/utils'
import sh from 'shelljs'
import lang from './lang'

const { t } = lang
const { gitDir } = getGitRevParse()

/**
 * Store the error log
 *
 * @param log - Error log
 */
export function setLog(log: GitmarsLogType): void {
	sh.touch(`${gitDir}/.gitmarslog`)
	sh.sed(
		'-i',

		/[\s\S]*/,
		encodeURIComponent(JSON.stringify(log)),
		`${gitDir}/.gitmarslog`,
	)
}

/**
 * Clear logs
 */
export function cleanLog() {
	removeFile({
		name: t('Gitmars package cache file'),
		url: `${gitDir}/.gitmarslog`,
	})
}
