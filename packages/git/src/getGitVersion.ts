import sh from 'shelljs'
import chalk from 'chalk'
import { spawnSync } from '@gitmars/utils'
import { debug } from '@gitmars/utils'
import lang from './lang'

const { t } = lang

/**
 * 获取git版本
 *
 * @returns version - 返回版本号
 */
function getGitVersion(): string | void {
	const { stdout } = spawnSync('git', ['--version'])
	let version: string | string[] | null = stdout!.match(/[\d.?]+/g) as string[]
	if (!version) {
		sh.echo(chalk.yellow(t('git not found')))
		process.exit(1)
		return
	}
	version = version[0]
	debug('getGitVersion', version)
	return version
}

export default getGitVersion
