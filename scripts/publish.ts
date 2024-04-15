import { execSync } from 'child_process'
import { join, sep } from 'path'
import consola from 'consola'
import { readJSONSync, writeJSONSync } from '@node-kit/extra.fs'
import { version } from '../package.json'
import { packages } from '../build/packages'

const [, , ...args] = process.argv
const IS_TEST = args.includes('--test')
const IS_DRY_RUN = args.includes('--dry-run')
export const ROOT = join(__dirname, '..')
export const PACKAGE = join(ROOT, 'packages')

const REGISTRY_URL = 'https://registry.npmjs.org'
let command = `npm --registry=${REGISTRY_URL} publish --access public`
if (IS_DRY_RUN) command += ' --dry-run'

if (version.includes('rc')) command += ' --tag release'
else if (version.includes('beta')) command += ' --tag beta'
else if (version.includes('alpha')) command += ' --tag alpha'
else if (IS_TEST) {
	console.warn(`${version} is not a test version, process exited`)
	process.exit(0)
}

for (const { name, pkgName } of packages) {
	const dirName = name.replace(/\./g, sep)
	const cwd = name === 'monorepo' ? ROOT : join(PACKAGE, dirName)
	const PKG_FILE = join(cwd, 'package.json')
	const pkgJson = readJSONSync(PKG_FILE)!
	const newPkgJson = JSON.parse(JSON.stringify(pkgJson))
	for (const { pkgName: pkg } of packages) {
		if (
			pkg in ((newPkgJson.dependencies as Record<string, unknown>) || {}) &&
			newPkgJson.dependencies[pkg].includes('workspace')
		) {
			newPkgJson.dependencies[pkg] = version
		}
		if (
			pkg in ((newPkgJson.devDependencies as Record<string, unknown>) || {}) &&
			newPkgJson.devDependencies[pkg].includes('workspace')
		) {
			newPkgJson.devDependencies[pkg] = version
		}
		if (
			pkg in ((newPkgJson.peerDependencies as Record<string, unknown>) || {}) &&
			newPkgJson.peerDependencies[pkg].includes('workspace')
		) {
			newPkgJson.peerDependencies[pkg] = version
		}
	}
	writeJSONSync(PKG_FILE, newPkgJson, {
		encoding: 'utf8'
	})
	execSync(command, {
		stdio: 'inherit',
		cwd
	})
	writeJSONSync(PKG_FILE, pkgJson, {
		encoding: 'utf8'
	})
	execSync(`npx prettier --write ${PKG_FILE}`, {
		stdio: 'inherit',
		cwd: ROOT
	})
	consola.success(`Published ${pkgName}`)
}
