import { execSync } from 'child_process'
import { join, sep } from 'path'
import { clone } from 'js-cool'
import { readJSONSync, writeJSONSync } from '@node-kit/extra.fs'
import { version } from '../package.json'
import { packages } from '../build/packages'

const [, , ...args] = process.argv
const IS_TEST = args.includes('--test')
const IS_DRY_RUN = args.includes('--dry-run')
export const ROOT = join(__dirname, '..')
export const PACKAGE = join(ROOT, 'packages')

const REGISTRY_URL = 'https://registry.npmjs.org'
const jsonMap: Record<string, any> = {}
let command = `pnpm --registry=${REGISTRY_URL} publish -r --access public`
if (IS_DRY_RUN) command += ' --dry-run'

if (version.includes('rc')) command += ' --tag release'
else if (version.includes('beta')) command += ' --tag beta'
else if (version.includes('alpha')) command += ' --tag alpha'
else if (IS_TEST) {
	console.warn(`${version} is not a test version, process exited`)
	process.exit(0)
}

transformPkgJson()

execSync(command, {
	stdio: 'inherit',
	cwd: ROOT
})

transformPkgJson(true)

function transformPkgJson(isFallback = false) {
	for (const { name } of packages) {
		const dirName = name.replace(/\./g, sep)
		const cwd = name === 'monorepo' ? ROOT : join(PACKAGE, dirName)
		const PKG_FILE = join(cwd, 'package.json')
		if (!isFallback) {
			jsonMap[name] = readJSONSync(PKG_FILE)!
			const newPkgJson = clone(jsonMap[name])
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
		} else {
			writeJSONSync(PKG_FILE, jsonMap[name], {
				encoding: 'utf8'
			})
		}
		execSync(`npx prettier --write ${PKG_FILE}`, {
			stdio: 'inherit',
			cwd: ROOT
		})
	}
}
