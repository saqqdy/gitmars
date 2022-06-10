import { execSync } from 'child_process'
import { join } from 'path'
import consola from 'consola'
import { PACKAGE } from '../build/utils/paths'
import { readJSON, writeJSON } from '../build/utils/fs'
import { version } from '../package.json'
import { packages } from '../build/packages'

// execSync('pnpm build', { stdio: 'inherit' })

const REGISTRY_URL = 'https://registry.npmjs.org'
let command = `npm --registry=${REGISTRY_URL} publish --access public`

if (version.includes('rc')) command += ' --tag release'
if (version.includes('beta')) command += ' --tag beta'
if (version.includes('alpha')) command += ' --tag alpha'

for (const { name, pkgName } of packages) {
    const pkgJson = readJSON(join(PACKAGE, name, 'package.json'))
    const newPkgJson = JSON.parse(JSON.stringify(pkgJson))
    for (const { pkgName: pkg } of packages) {
        if (
            pkg in ((newPkgJson.dependencies as Record<string, unknown>) || {})
        ) {
            newPkgJson.dependencies[pkg] = version
        }
        if (
            pkg in
            ((newPkgJson.devDependencies as Record<string, unknown>) || {})
        ) {
            newPkgJson.devDependencies[pkg] = version
        }
        if (
            pkg in
            ((newPkgJson.peerDependencies as Record<string, unknown>) || {})
        ) {
            newPkgJson.peerDependencies[pkg] = version
        }
    }
    writeJSON(join(PACKAGE, name, 'package.json'), newPkgJson, {
        encoding: 'utf8'
    })
    execSync(command, {
        stdio: 'inherit',
        cwd: join('packages', name)
    })
    writeJSON(join(PACKAGE, name, 'package.json'), pkgJson, {
        encoding: 'utf8'
    })
    consola.success(`Published ${pkgName}`)
}
execSync(command, {
    stdio: 'inherit'
})
consola.success('Published @gitmars/monorepo')
