/* 1eslint-disable no-console */
const os = require('os')
const fs = require('fs')
const path = require('path')
const { spawnSync, execSync } = require('child_process')
const cwd = process.cwd()

type TypeManagers = 'npm' | 'pnpm' | 'yarn' | string

const PACKAGE_NEXT = ['vue', 'vuex', 'vue-router']
const PACKAGE_MANAGERS: TypeManagers[] = ['yarn', 'pnpm', 'npm']

let pkg = fs.readFileSync(path.join(cwd, 'package.json')),
    list = ['--registry', 'https://registry.npmmirror.com']

pkg = JSON.parse(pkg)
const dependencies = { ...pkg.devDependencies, ...pkg.dependencies }
const cmd = getPackageManager()

switch (cmd) {
    case 'pnpm':
        list = list.concat(['i', '-WD'])
        break
    case 'yarn':
        list = list.concat(['add', '-WD'])
        break
    case 'npm':
        list = list.concat(['i', '-D'])
        break
    default:
        list = list.concat(['i', '-WD'])
        break
}

// @next
for (let packageName in dependencies) {
    if (PACKAGE_NEXT.includes(packageName)) packageName += '@next'
    list.push(packageName)
}

// run install
if (list.length > 0) {
    spawnSync(cmd, list, {
        stdio: 'inherit',
        shell: process.platform === 'win32' /*, env: { detached: true } */
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
