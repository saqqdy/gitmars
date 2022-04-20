import { execSync } from 'child_process'
import { packages } from '../build/packages'
let [, , propName] = process.argv

if (!propName) process.exit(1)
propName = propName.replace(/\"/g, '')
const propNames = propName.split(',')

const REGISTRY_URL = 'https://registry.npmjs.org'
const command = `npm --registry=${REGISTRY_URL} view`

for (const { pkgName } of packages) {
    for (const name of propNames) {
        execSync(`${command} ${pkgName} ${name}`, {
            stdio: 'inherit'
        })
    }
}
