const os = require('os')
const fs = require('fs')
const { join } = require('path')
const { spawnSync, execSync } = require('child_process')

let [, , cwd = ''] = process.argv,
    pkg: any,
    list = ['--registry', 'https://registry.npmmirror.com']
const ROOT = join(__dirname, '..')
cwd = join(ROOT, cwd.replace(/"/g, ''))

if (!cwd) {
    list.push('-w')
    cwd = process.cwd()
}

type TypeManagers = 'npm' | 'pnpm' | 'yarn' | string

const PACKAGE_NEXT = []
const PACKAGE_EXCLUDE = []
const PACKAGE_MANAGERS: TypeManagers[] = ['pnpm', 'yarn', 'npm']

pkg = fs.readFileSync(join(cwd, 'package.json'))

pkg = JSON.parse(pkg)
const dependencies = { ...pkg.devDependencies, ...pkg.dependencies }
const cmd = getPackageManager()

switch (cmd) {
    case 'pnpm':
        list = list.concat(['i'])
        break
    case 'yarn':
        list = list.concat(['add'])
        break
    case 'npm':
        list = list.concat(['i'])
        break
    default:
        list = list.concat(['i'])
        break
}

// @next
for (let packageName in dependencies) {
    const isWorkspacePkg = dependencies[packageName] === 'workspace:*'
    const isExcludePkg = PACKAGE_EXCLUDE.includes(packageName)
    if (PACKAGE_NEXT.includes(packageName)) packageName += '@next'
    else packageName += '@latest'
    !isWorkspacePkg && !isExcludePkg && list.push(packageName)
}

// run install
if (list.length > 0) {
    spawnSync(cmd, list, {
        cwd,
        stdio: 'inherit',
        shell: process.platform === 'win32'
    })
} else {
    process.exit(1)
}

// 获取安装工具
function getPackageManager(): TypeManagers {
    const { packageManager = '' } = pkg
    if (packageManager) return packageManager.replace(/@.+$/, '')
    for (const manager of PACKAGE_MANAGERS) {
        if (which(manager)) return manager
    }
    return 'npm'
}

function which(cmd: string): Boolean {
    try {
        execSync(
            os.platform() === 'win32'
                ? `cmd /c "(help ${cmd} > nul || exit 0) && where ${cmd} > nul 2> nul"`
                : `command -v ${cmd}`
        )
        return true
    } catch {
        return false
    }
}
