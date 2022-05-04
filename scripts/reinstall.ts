const os = require('os')
const fs = require('fs')
const { join } = require('path')
const { spawnSync, execSync } = require('child_process')

type TypeManagers = 'npm' | 'pnpm' | 'yarn' | string

let [, , cwd = ''] = process.argv,
    pkg: any,
    argv = ['--registry', 'https://registry.npmmirror.com']
const isRoot = cwd === ''
const ROOT = join(__dirname, '..')
cwd = join(ROOT, cwd.replace(/"/g, ''))

pkg = fs.readFileSync(join(cwd, 'package.json'))
pkg = JSON.parse(pkg)

const PACKAGE_NEXT = []
const PACKAGE_EXCLUDE = []
const PACKAGE_MANAGERS: TypeManagers[] = ['pnpm', 'yarn', 'npm']
const cmd = getPackageManager()

switch (cmd) {
    case 'pnpm':
        argv = argv.concat(['i'])
        break
    case 'yarn':
        argv = argv.concat(['add'])
        break
    case 'npm':
        argv = argv.concat(['i'])
        break
    default:
        argv = argv.concat(['i'])
        break
}
if (isRoot) {
    argv.push('-w')
}

// @next
const pkgList = genInstallName(pkg.dependencies)
const devPkgList = genInstallName(pkg.devDependencies)

// run install
if (pkgList.length > 0 || devPkgList.length > 0) {
    pkgList.length &&
        spawnSync(cmd, argv.concat(pkgList), {
            cwd,
            stdio: 'inherit',
            shell: process.platform === 'win32'
        })
    devPkgList.length &&
        spawnSync(cmd, argv.concat(devPkgList).concat(['-D']), {
            cwd,
            stdio: 'inherit',
            shell: process.platform === 'win32'
        })
} else {
    process.exit(1)
}

function genInstallName(dependencies) {
    const pkgList: string[] = []
    for (let packageName in dependencies) {
        const isWorkspacePkg = dependencies[packageName] === 'workspace:*'
        const isExcludePkg = PACKAGE_EXCLUDE.includes(packageName)
        if (PACKAGE_NEXT.includes(packageName)) packageName += '@next'
        else packageName += '@latest'
        if (!isWorkspacePkg && !isExcludePkg) {
            pkgList.push(packageName)
        }
    }
    return pkgList
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
