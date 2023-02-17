import { execSync } from 'child_process'
import consola from 'consola'
import { packages } from '../build/packages'
let [, , versionText, description] = process.argv
consola.log(versionText, description)
if (!versionText) {
	consola.error('Please input the versionText')
	process.exit(1)
}
if (!description) {
	consola.error('Please input the description')
	process.exit(1)
}
versionText = versionText.replace(/\"/g, '')
description = description.replace(/\"/g, '')
const versions = versionText.split(',')

const REGISTRY_URL = 'https://registry.npmjs.org'
const command = `npm --registry=${REGISTRY_URL} deprecate -f`

for (const { pkgName } of packages) {
	for (const version of versions) {
		execSync(`${command} ${pkgName}@${version} ${description}`, {
			stdio: 'inherit'
		})
		consola.success(`Deprecated ${pkgName}@${version}`)
	}
}

for (const version of versions) {
	execSync(`${command} @gitmars/monorepo@${version} ${description}`, {
		stdio: 'inherit'
	})
	consola.success(`Deprecated @gitmars/monorepo@${version}`)
}
