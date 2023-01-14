import { join } from 'path'
import { parallel, series } from 'gulp'
import { wrapDisplayName } from './utils/gulp'
import { runExecSync } from './utils/exec'
import { buildLib, copyLibFile, madgeLib } from './tasks/buildLib'
import { buildApp } from './tasks/buildApp'
import { buildDocs, copyMdFile } from './tasks/buildDocs'
import { buildType } from './tasks/buildType'
import { packages } from './packages'

export async function clean() {
	let dirs: string[] = ['dist', 'es', 'lib']
	packages.forEach(({ name }) => {
		dirs = dirs.concat([
			join('packages', name, 'dist'),
			join('packages', name, 'es'),
			join('packages', name, 'lib')
		])
	})
	await runExecSync(`rimraf ${dirs.join(' ')}`)
}
export { default as lib } from './tasks/buildLib'
export { default as app } from './tasks/buildApp'
export { default as docs } from './tasks/buildDocs'
export { default as type } from './tasks/buildType'
export default series(
	wrapDisplayName('clean:dist,es,lib', clean),
	parallel(
		wrapDisplayName('copy:md', copyMdFile),
		wrapDisplayName('copy-lib:json,sh', copyLibFile)
	),
	parallel(
		wrapDisplayName('build:lib', buildLib),
		wrapDisplayName('build:docs', buildDocs),
		wrapDisplayName('build:type', buildType)
	),
	parallel(wrapDisplayName('build:app', buildApp)),
	parallel(wrapDisplayName('madge:lib', madgeLib))
)
