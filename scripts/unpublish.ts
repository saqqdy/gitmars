import { execSync } from 'child_process'
import consola from 'consola'
import { packages } from '../build/packages'
let [, , versionText] = process.argv

if (!versionText) process.exit(1)
versionText = versionText.replace(/\"/g, '')
const versions = versionText.split(',')

const REGISTRY_URL = 'https://registry.npmjs.org'
// const command = `npm --registry=${REGISTRY_URL} unpublish`
const command = `npm --registry=${REGISTRY_URL} deprecate`

for (const { pkgName } of packages) {
	for (const version of versions) {
		execSync(
			// `${command} ${pkgName}@${version}`,
			`${command} ${pkgName}@${version} "This version is deprecated, please use the latest version"`,
			{
				stdio: 'inherit'
			}
		)
		consola.success(`UnPublished ${pkgName}@${version}`)
	}
}
