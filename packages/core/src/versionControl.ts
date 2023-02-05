import { createRequire } from 'node:module'
import sh from 'shelljs'
import chalk from 'chalk'
import semverDiff from 'semver-diff'
// import { version } from '../package.json' assert { type: 'json' }
import type { VersionControlType } from '../typings'
import { getPkgInfo } from '#lib/utils/pkgInfo'
import { debug } from '#lib/utils/debug'
import lang from '#lib/lang'

const { t } = lang
const require = createRequire(import.meta.url)
const { version } = require('../package.json')

/**
 * Determine if a version upgrade is needed
 *
 * @param type - VersionControlType, default: minor
 * @returns - isNeedUpgrade, true/false
 */
export async function isNeedUpgrade(type?: VersionControlType): Promise<boolean> {
	type ??= 'minor'
	const { 'dist-tags': tags, versions } = await getPkgInfo()
	debug('tags-versions', tags, versions)
	// let compareVers = []
	// if (version.indexOf('1.') === 0) {
	//     // compareVers = versions.filter(
	//     //     (item: string) => /^1\./.test(item) && !item.match(/[a-z]+/g)
	//     // )
	//     // // 有落后middle以上的版本需要更新版本
	//     // for (let ver of versions) {
	//     //     if (/^1\./.test(ver) && parseFloat(ver) > parseFloat(ver)) {
	//     //         return true
	//     //     }
	//     // }
	//     // return false
	//     return parseFloat(tags.lite) > parseFloat(version)
	// }
	const semver = semverDiff(version, tags.latest)
	if (!type || !semver) return false
	return (
		(type === 'patch' && ['major', 'minor', 'patch'].includes(semver)) ||
		(type === 'minor' && ['major', 'minor'].includes(semver)) ||
		(type === 'major' && ['major'].includes(semver))
	)
}

/**
 * Upgrade version tips
 */
export function upgradeGitmars() {
	sh.echo(
		chalk.red(t('Your version is detected as old, please upgrade before using')) +
			chalk.green(
				t(
					'\nMac users upgrade method: sudo gitm upgrade latest -m -c npm \nWindows users use PowerShell or CMD: gitm upgrade latest -m -c npm.cmd'
				)
			)
	)
	process.exit(1)
}

export default {
	isNeedUpgrade,
	upgradeGitmars
}
