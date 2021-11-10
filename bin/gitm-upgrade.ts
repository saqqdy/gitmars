#!/usr/bin/env ts-node
const { program } = require('commander')
const { spawnSync } = require('child_process')
const sh = require('shelljs')
const { options, args } = require('./conf/upgrade')
const { success } = require('./js/index')
const { createArgs } = require('./js/tools')
const ora = require('ora')

import { GitmarsOptionOptionsType, PackageVersionTag } from '../typings'

interface GitmBuildOption {
    mirror?: boolean
    client?: 'npm' | 'yarn' | 'pnpm' | 'cnpm' | string
    registry?: string
}

/**
 * gitm upgrade
 */
program
    .name('gitm upgrade')
    .usage(
        '[version] [-m --mirror] [-c --client [client]] [-r --registry <registry>]'
    )
    .description('升级gitmars')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-m, --mirror', '是否使用淘宝镜像', false)
// .option('-c, --client [client]', '用于装包的客户端名称', 'npm')
// .option('-r, --registry <registry]>', '使用镜像地址', '')
program.action(async (version: PackageVersionTag | string, opt: GitmBuildOption) => {
    const spinner = ora(success('正在安装请稍后')).start()
    if (version) {
        const match = version.match(/[0-9.]+$/)
        if (match) version = match[0]
        else if (
            !['alpha', 'lite', 'beta', 'release', 'latest', 'next'].includes(
                version
            )
        ) {
            console.error('输入的版本号不正确')
            sh.exit(0)
        }
    } else {
        version = 'latest'
    }
    let cmdAdd: any[], cmdDel: any[]
    switch (opt.client) {
        case 'yarn':
            cmdAdd = [opt.client, ['global', 'add', `gitmars@${version}`]]
            cmdDel = [opt.client, ['global', 'remove', 'gitmars']]
            break
        case 'pnpm':
            cmdAdd = [opt.client, ['add', '-g', `gitmars@${version}`]]
            cmdDel = [opt.client, ['remove', '-g', 'gitmars']]
            break
        default:
            // default npm or cnpm
            cmdAdd = [opt.client, ['install', '-g', `gitmars@${version}`]]
            cmdDel = [opt.client, ['uninstall', '-g', 'gitmars']]
            break
    }
    // 这一行后面准备删掉
    if (!opt.registry && opt.mirror)
        opt.registry = 'https://registry.npm.taobao.org'
    if (opt.registry) cmdAdd[1] = cmdAdd[1].concat(['-registry', opt.registry])
    const uninstall = spawnSync(cmdDel[0], cmdDel[1], {
        stdio: 'inherit',
        shell: process.platform === 'win32' /*, env: { detached: true }*/
    })
    if (uninstall.status !== 0) {
        console.warn('卸载出错了')
        process.exit(0)
    }
    const install = spawnSync(cmdAdd[0], cmdAdd[1], {
        stdio: 'inherit',
        shell: process.platform === 'win32' /*, env: { detached: true }*/
    })
    spawnSync('gitm', ['-v'], {
        stdio: 'inherit',
        shell: process.platform === 'win32' /*, env: { detached: true }*/
    })
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
