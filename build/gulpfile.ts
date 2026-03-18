import { join } from 'node:path'
import { parallel, series } from 'gulp'
import { getLibPackages } from './packages'
import { buildApp } from './tasks/buildApp'
import { buildDocs, copyMdFile } from './tasks/buildDocs'
import { buildLib, copyLibFile, madgeLib } from './tasks/buildLib'
import { buildType } from './tasks/buildType'
import { runExecSync } from './utils/exec'
import { wrapDisplayName } from './utils/gulp'

const pkgs = getLibPackages()

export async function clean() {
	let dirs: string[] = []

	pkgs.forEach(({ name, output = 'dist' }) => {
		dirs = dirs.concat([join('packages', name, output)])
	})
	await runExecSync(`rimraf ${dirs.join(' ')}`)
}
export { default as app } from './tasks/buildApp'
export { default as docs } from './tasks/buildDocs'
export { default as lib } from './tasks/buildLib'
export { default as type } from './tasks/buildType'
export default series(
	wrapDisplayName('clean output dirs', clean),
	parallel(
		wrapDisplayName('copy:md', copyMdFile),
		wrapDisplayName('copy-lib:json,sh', copyLibFile),
	),
	wrapDisplayName('build:type', buildType),
	parallel(
		wrapDisplayName('build:lib', buildLib),
		wrapDisplayName('build:docs', buildDocs),
	),
	parallel(wrapDisplayName('build:app', buildApp)),
	parallel(wrapDisplayName('madge:lib', madgeLib)),
)
