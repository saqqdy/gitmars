/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')
const cwd = process.cwd()
let pkg = fs.readFileSync(path.join(cwd, 'package.json')),
    dependencies,
    list = ['--registry', 'https://registry.npmmirror.com', 'add']
pkg = JSON.parse(pkg)
dependencies = { ...pkg.devDependencies, ...pkg.dependencies }
for (let packageName in dependencies) {
    if (['vue', 'vuex', 'vue-router'].includes(packageName))
        packageName += '@next'
    list.push(packageName)
}
if (list.length > 0) {
    spawnSync('yarn', list, {
        stdio: 'inherit',
        shell: process.platform === 'win32' /*, env: { detached: true }*/
    })
} else {
    process.exit(1)
}
