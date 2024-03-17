import chalk from 'chalk'
import sh from 'shelljs'
import { spawnSync } from '#lib/spawn'
import { debug } from '#lib/utils/debug'
import lang from '#lib/lang'

const { t } = lang

/**
 * Get git token from git config
 *
 * @param throwOnError - throw on token is null, default: true
 * @returns - token
 */
export function getGitToken(throwOnError = true): string {
	const { stdout } = spawnSync('git', ['config', 'user.token'])
	debug('git.token', stdout)

	if (!stdout) {
		sh.echo(chalk.red(t('Please set git access token')))
		process.exit(1)
	}
	return stdout
}

/**
 * Get git name from git config
 *
 * @returns - user
 */
export function getGitUser(): string {
	const { stdout } = spawnSync('git', ['config', 'user.name'])
	debug('git.user', stdout)
	return stdout!
}

/**
 * Get git email from git config
 *
 * @returns - email
 */
export function getGitEmail(): string {
	const { stdout } = spawnSync('git', ['config', 'user.email'])
	debug('git.email', stdout)
	return stdout!
}
