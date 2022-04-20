import { execSync } from 'child_process'
import { packages } from '../build/packages'

const cmd = process.platform === 'win32' ? 'start' : 'open'

for (const pkg of packages) {
    execSync(`${cmd} https://npmmirror.com/sync/${pkg.pkgName}`)
}
