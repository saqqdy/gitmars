import { execSync } from 'child_process'
import { join } from 'path'
import consola from 'consola'
import { readJSONSync, writeJSONSync } from '@node-kit/extra.fs'
import { PACKAGE, ROOT } from '../build/utils/paths'
import { version } from '../package.json'
import { packages } from '../build/packages'

// execSync('pnpm build', { stdio: 'inherit' })

const [, , ...args] = process.argv
const IS_TEST = args.includes('--test')
const REGISTRY_URL = 'https://registry.npmjs.org'
let command = `npm --registry=${REGISTRY_URL} publish --access public`

if (version.includes('rc')) command += ' --tag release'
else if (version.includes('beta')) command += ' --tag beta'
else if (version.includes('alpha')) command += ' --tag alpha'
else if (IS_TEST) {
	console.warn(`${version} is not a test version, process exited`)
	process.exit(0)
}

for (const { name, pkgName } of packages) {
	const PKG_FILE = join(PACKAGE, name, 'package.json')
	const pkgJson = readJSONSync(PKG_FILE)
	const newPkgJson = JSON.parse(JSON.stringify(pkgJson))
	for (const { pkgName: pkg } of packages) {
		if (pkg in ((newPkgJson.dependencies as Record<string, unknown>) || {})) {
			newPkgJson.dependencies[pkg] = version
		}
		if (pkg in ((newPkgJson.devDependencies as Record<string, unknown>) || {})) {
			newPkgJson.devDependencies[pkg] = version
		}
		if (pkg in ((newPkgJson.peerDependencies as Record<string, unknown>) || {})) {
			newPkgJson.peerDependencies[pkg] = version
		}
	}
	writeJSONSync(PKG_FILE, newPkgJson, {
		encoding: 'utf8'
	})
	execSync(command, {
		stdio: 'inherit',
		cwd: join('packages', name)
	})
	writeJSONSync(PKG_FILE, pkgJson!, {
		encoding: 'utf8'
	})
	execSync(`npx prettier --write ${PKG_FILE}`, {
		stdio: 'inherit',
		cwd: ROOT
	})
	consola.success(`Published ${pkgName}`)
}
execSync(command, {
	stdio: 'inherit'
})
consola.success('Published @gitmars/monorepo')
