import fs from 'node:fs'
import path from 'node:path'
import { getConfig, getGitRevParse, getGitVersion } from '@gitmars/git'
import chalk from 'chalk'
import ciInfo from 'ci-info'
import { compareVersion } from 'js-cool'
import sh from 'shelljs'
import getHookComment from './getHookComment'
import getHookShell from './getHookShell'
import getHookType from './getHookType'
import getLocalShell from './getLocalShell'
import lang from './lang'

const { t } = lang
const hookList = [
	'applypatch-msg',
	'pre-applypatch',
	'post-applypatch',
	'pre-commit',
	'pre-merge-commit',
	'prepare-commit-msg',
	'commit-msg',
	'post-commit',
	'pre-rebase',
	'post-checkout',
	'post-merge',
	'pre-push',
	'post-update',
	'push-to-checkout',
	'pre-auto-gc',
	'post-rewrite',
	'sendemail-validate',
]
const { gitHookDir, prefix } = getGitRevParse()
const gitVersion = getGitVersion()
const config = getConfig()

/**
 * Create git hooks
 *
 * @param dir - Target directory, defaults to gitHookDir
 */
export function createHooks(dir: string = gitHookDir): void {
	// Helper that creates a hook file
	const writeHook = (filename: string, shell: string): void => {
		fs.writeFileSync(filename, shell, 'utf-8')
		fs.chmodSync(filename, 0o0755)
	}
	const hooks = hookList.map((hookName: string) => path.join(dir, hookName))

	hooks.forEach((filename: string) => {
		const hookShell = `#!/bin/sh
# gitmars

${getHookComment()}

. "$(dirname "$0")/gitmars.sh"`
		const name = path.basename(filename)

		// Check whether the hook file already exists
		if (fs.existsSync(filename)) {
			const hook = fs.readFileSync(filename, 'utf-8')

			// Merge
			if (getHookType.isGhooks(hook)) {
				console.info(t('Merge existing ghooks hooks: {name}', { name }))

				return writeHook(filename, hookShell)
			}
			// Merge
			if (getHookType.isPreCommit(hook)) {
				console.info(
					t('Merge existing pre-commit hooks: {name}', {
						name,
					}),
				)

				return writeHook(filename, hookShell)
			}
			// Update
			if (
				getHookType.isGitmars(hook) ||
				getHookType.isHusky(hook) ||
				getHookType.isYorkie(hook)
			) {
				return writeHook(filename, hookShell)
			}
			// Skip
			console.info(
				t('Skip existing git hooks: {name}', {
					name,
				}),
			)

			return
		}
		// Create the hook when it does not exist
		writeHook(filename, hookShell)
	})
}

/**
 * Remove git hooks
 *
 * @param dir - Target directory, defaults to gitHookDir
 * @returns result - boolean|void
 */
export function removeHooks(dir: string = gitHookDir): boolean | void {
	const hooks = hookList.map((hookName: string) => path.join(dir, hookName))

	hooks
		.filter((filename: string) => {
			if (fs.existsSync(filename)) {
				const hook = fs.readFileSync(filename, 'utf-8')

				return getHookType.isGitmars(hook)
			}

			return false
		})
		.forEach((filename: string) => {
			fs.unlinkSync(filename)
		})
}

/**
 * Create the main program
 *
 * @param dir - Target directory, defaults to gitHookDir
 */
export function createHookShell(dir: string = gitHookDir): void {
	const filename = path.join(dir, 'gitmars.sh')

	fs.writeFileSync(filename, getHookShell(), 'utf-8')
	fs.chmodSync(filename, 0o0755)
}

/**
 * Remove the main program
 *
 * @param dir - Target directory, defaults to gitHookDir
 */
export function removeHookShell(dir: string = gitHookDir): void {
	const filename = path.join(dir, 'gitmars.sh')

	if (fs.existsSync(filename)) fs.unlinkSync(filename)
}

/**
 * Create the local shell script
 *
 * @param dir - Target directory, defaults to gitHookDir
 * @param pmName - Package manager name
 * @param relativeUserPkgDir - Relative path to the user package
 */
export function createLocalShell(
	dir: string = gitHookDir,
	pmName: string,
	relativeUserPkgDir: string,
): void {
	const filename = path.join(dir, 'gitmars.local.sh')

	fs.writeFileSync(filename, getLocalShell(pmName, relativeUserPkgDir), 'utf-8')
	fs.chmodSync(filename, 0o0755)
}

/**
 * Remove the local shell script
 *
 * @param dir - Target directory, defaults to gitHookDir
 */
export function removeLocalShell(dir: string = gitHookDir): void {
	const filename = path.join(dir, 'gitmars.local.sh')

	if (fs.existsSync(filename)) fs.unlinkSync(filename)
}

/**
 * Initialize hooks
 */
export function init(): void {
	const gitVersionIsNew = gitVersion && compareVersion(gitVersion, '2.13.0') > -1

	// Skip installation in CI environments
	if (ciInfo.isCI && config.skipCI) {
		console.info(t('Continuous integration environment, skip hook installation'))

		return
	}
	// Create the hooks directory when missing
	if (!fs.existsSync(gitHookDir)) {
		fs.mkdirSync(gitHookDir)
	}
	if (['1', 'true'].includes(process.env.GITMARS_SKIP_HOOKS || '')) {
		sh.echo(
			chalk.yellow(
				t('Environment variable GITMARS_SKIP_HOOKS already exists, skip installation'),
			),
		)
		process.exit(0)
	}
	// Git version is too old
	if (!gitVersionIsNew) {
		sh.echo(
			chalk.yellow(
				`${t('Gitmars requires Git version 2.13.0 or higher, current version')
					}: ${
					gitVersion}`,
			),
		)
		process.exit(0)
	}
	createHooks(gitHookDir)
	createHookShell(gitHookDir)
	createLocalShell(gitHookDir, 'yarn', prefix)
	console.info('gitmars hooks init down')
}

/**
 * Remove hooks
 */
export function remove(): void {
	removeHooks()
	removeHookShell()
	removeLocalShell()
	console.info('gitmars hooks removed')
}

export { default as run } from './run'

// export default {
// 	init,
// 	remove,
// 	createHooks,
// 	removeHooks,
// 	createHookShell,
// 	removeHookShell,
// 	createLocalShell,
// 	removeLocalShell
// }
