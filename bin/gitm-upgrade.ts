#!/usr/bin/env node
const { program } = require('commander')
const { spawnSync } = require('child_process')
const sh = require('shelljs')
const { options, args } = require('./conf/upgrade')
const { success } = require('./js/index')
const { createArgs } = require('./js/tools')
const ora = require('ora')

import { GitmarsOptionOptionsType } from '../typings'

interface GitmBuildOption {
    mirror: boolean
}

/**
 * gitm upgrade
 */
program.name('gitm upgrade').usage('[version]').description('升级gitmars')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-m, --mirror', '是否使用淘宝镜像', false)
program.action(async (version: string, opt: GitmBuildOption) => {
    const spinner = ora(success('正在安装请稍后')).start()
    const match = (version && version.match(/[0-9.]+$/)) || null
    const cmdAdd: any[] = ['npm', ['install', '-g', `gitmars@${match ? match[0] : 'latest'}`]]
    const cmdDel = ['npm', ['uninstall', '-g', 'gitmars']]
    if (opt.mirror) cmdAdd[1] = cmdAdd[1].concat(['-registry', 'https://registry.npm.taobao.org'])
    const uninstall = spawnSync(cmdDel[0], cmdDel[1], { stdio: 'inherit', shell: process.platform === 'win32' /*, env: { detached: true }*/ })
    if (uninstall.status !== 0) {
        console.warn('卸载出错了')
        process.exit(0)
    }
    const install = spawnSync(cmdAdd[0], cmdAdd[1], { stdio: 'inherit', shell: process.platform === 'win32' /*, env: { detached: true }*/ })
    spawnSync('gitm', ['-v'], { stdio: 'inherit', shell: process.platform === 'win32' /*, env: { detached: true }*/ })
    sh.echo(`\n${success('安装完成')}`)
    spinner.stop()
    if (install.status === 0) {
        process.exit(0)
    } else {
        console.warn('安装出错了')
        process.exit(0)
    }
})
program.parse(process.argv)
export {}
