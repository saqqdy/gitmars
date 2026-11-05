import { debug, spawnSync } from '@gitmars/utils'
import chalk from 'chalk'
import sh from 'shelljs'
import lang from './lang'

const { t } = lang

/**
 * Get the git version
 *
 * @returns version - The detected version
 */
function getGitVersion(): string | void {
	const { stdout } = spawnSync('git', ['--version'])
	let version: string | string[] | null = stdout!.match(/[\d.?]+/g) as string[]

	if (!version) {
		sh.echo(chalk.yellow(t('Git not found')))
		process.exit(1)

		return
	}
	version = version[0]
	debug('getGitVersion', version)

	return version
}

export default getGitVersion
