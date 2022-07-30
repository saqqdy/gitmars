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

const useWorkspace = true // 是否启用了workspace模式
const PACKAGE_NEXT: string[] = [] // 需要安装next版本的包
const PACKAGE_EXCLUDE: string[] = [] // 忽略的包
const PACKAGE_MANAGERS: TypeManagers[] = ['pnpm', 'yarn', 'npm'] // 包管理工具优先级
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
if (isRoot && useWorkspace) {
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

function genInstallName(dependencies: Record<string, string>) {
    const pkgList: string[] = []
    for (let packageName in dependencies) {
        const isWorkspacePkg = dependencies[packageName] === 'workspace:*'
        const isCustomize = /^npm:/.test(dependencies[packageName])
        const isExcludePkg = PACKAGE_EXCLUDE.includes(packageName)
        if (isCustomize) packageName += `@${dependencies[packageName]}`
        else if (PACKAGE_NEXT.includes(packageName)) packageName += '@next'
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
