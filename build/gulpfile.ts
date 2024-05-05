import { join } from 'path'
import { parallel, series } from 'gulp'
import { wrapDisplayName } from './utils/gulp'
import { runExecSync } from './utils/exec'
import { buildLib, copyLibFile, madgeLib } from './tasks/buildLib'
import { buildApp } from './tasks/buildApp'
import { buildDocs, copyMdFile } from './tasks/buildDocs'
import { buildType } from './tasks/buildType'
import { getLibPackages } from './packages'

const pkgs = getLibPackages()

export async function clean() {
	let dirs: string[] = []
	pkgs.forEach(({ name, output = 'dist' }) => {
		dirs = dirs.concat([join('packages', name, output)])
	})
	await runExecSync(`rimraf ${dirs.join(' ')}`)
}
export { default as lib } from './tasks/buildLib'
export { default as app } from './tasks/buildApp'
export { default as docs } from './tasks/buildDocs'
export { default as type } from './tasks/buildType'
export default series(
	wrapDisplayName('clean output dirs', clean),
	parallel(
		wrapDisplayName('copy:md', copyMdFile),
		wrapDisplayName('copy-lib:json,sh', copyLibFile)
	),
	wrapDisplayName('build:type', buildType),
	parallel(wrapDisplayName('build:lib', buildLib), wrapDisplayName('build:docs', buildDocs)),
	parallel(wrapDisplayName('build:app', buildApp)),
	parallel(wrapDisplayName('madge:lib', madgeLib))
)
