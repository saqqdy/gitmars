import { execSync } from 'node:child_process'
import { packages } from '../build/packages'

// const cmd = process.platform === 'win32' ? 'start' : 'open'

for (const pkg of packages) {
	// execSync(`${cmd} https://npmmirror.com/sync/${pkg.pkgName}`)
	execSync(
		`curl -X PUT -d "sync_upstream=true" "https://registry-direct.npmmirror.com/${pkg.pkgName}/sync"`
	)
}
