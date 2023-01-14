import sh from 'shelljs'
import chalk from 'chalk'
import { debug } from '#lib/utils/debug'
import getGitStatus from '#lib/git/getGitStatus'
import lang from '#lib/lang'

const { t } = lang

/**
 * Detect status and get if there are uncommitted files
 *
 * @returns isOK - Return true/false
 */
function checkGitStatus(): boolean {
	const sum = getGitStatus()
	debug('checkGitStatus', sum)
	if (sum.A.length > 0 || sum.D.length > 0 || sum.M.length > 0 || sum.UU.length > 0) {
		sh.echo(
			chalk.red(
				t('You still have uncommitted files, please process them before continuing')
			) +
				'\n' +
				t('If you need to staging files please do: gitm save\nWhen resuming: gitm get')
		)
		return false
	} else if (sum['??'].length > 0) {
		sh.echo(
			chalk.yellow(t('You have uncommitted files')) +
				',\n' +
				t(
					'If you need to staging files please run: gitm save --force\nWhen resuming: gitm get'
				)
		)
	}
	return true
}

export default checkGitStatus
