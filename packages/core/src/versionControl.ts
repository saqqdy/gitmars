import { createRequire } from 'node:module'
import sh from 'shelljs'
import chalk from 'chalk'
import semverDiff from 'semver-diff'
// import { version } from '../package.json' assert { type: 'json' }
import { getPkgInfo } from '@gitmars/cache'
import { debug } from '@gitmars/utils'
import type { VersionControlType } from './types'
import lang from './lang'

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
	const { 'dist-tags': tags } = await getPkgInfo()
	let tagVersion = tags.latest,
		isPreVer = false

	if (version.includes('alpha')) {
		tagVersion = tags.alpha
		isPreVer = true
	} else if (version.includes('beta')) {
		tagVersion = tags.beta
		isPreVer = true
	} else if (version.includes('rc')) {
		tagVersion = tags.rc
		isPreVer = true
	}
	debug('tags-versions', tags, tagVersion)
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
	const semverTag = semverDiff(version, tagVersion)

	if (!type) return false
	if (isPreVer) return Boolean(semver || semverTag)
	else if (!semver) return false
	return (
		(type === 'patch' &&
			['prerelease', 'major', 'premajor', 'minor', 'preminor', 'patch', 'prepatch'].includes(
				semver
			)) ||
		(type === 'minor' &&
			['prerelease', 'major', 'premajor', 'minor', 'preminor'].includes(semver)) ||
		(type === 'major' && ['prerelease', 'major', 'premajor'].includes(semver))
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
