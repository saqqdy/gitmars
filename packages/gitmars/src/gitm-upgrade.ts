#!/usr/bin/env ts-node
import type { GitmarsOptionOptionsType, PackageVersionTag } from '../typings'
const { program } = require('commander')
const { green, red } = require('colors')
const ora = require('ora')
const { spawnSync } = require('@gitmars/core/es/spawn')
const { createArgs } = require('@gitmars/core/es/utils/command')
const { options, args } = require('./conf/upgrade')

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
program.action(
    async (version: PackageVersionTag | string, opt: GitmBuildOption) => {
        const spinner = ora()
        if (version) {
            const match = version.match(/[0-9.]+$/)
            if (match) version = match[0]
            else if (
                ![
                    'alpha',
                    'lite',
                    'beta',
                    'release',
                    'latest',
                    'next'
                ].includes(version)
            ) {
                console.error(
                    '输入的版本号不正确，仅支持：alpha、lite、beta、release、latest、next'
                )
                process.exit(0)
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
        if (!opt.registry && opt.mirror) {
            opt.registry = 'https://registry.npmmirror.com'
        }
        if (opt.registry) {
            cmdAdd[1] = cmdAdd[1].concat(['-registry', opt.registry])
        }
        spinner.start(green('正在卸载'))
        const uninstall = spawnSync(cmdDel[0], cmdDel[1], {
            stdio: 'ignore',
            shell: process.platform === 'win32' /*, env: { detached: true } */
        })
        if (uninstall.status !== 0) {
            spinner.fail(
                red('卸载出错了，请尝试手动删除后运行：npm install -g gitmars')
            )
            process.exit(0)
        }
        spinner.succeed(green('卸载完成'))
        spinner.start(green('正在安装'))
        const install = spawnSync(cmdAdd[0], cmdAdd[1], {
            stdio: 'ignore',
            shell: process.platform === 'win32' /*, env: { detached: true } */
        })
        if (install.status === 0) {
            spinner.succeed(green('安装完成'))
            spawnSync('gitm', ['-v'], {
                stdio: 'inherit',
                shell:
                    process.platform === 'win32' /*, env: { detached: true } */
            })
        } else {
            spinner.fail(red('安装出错了，请尝试运行：npm install -g gitmars'))
        }
        spinner.stop()
        process.exit(0)
    }
)
program.parse(process.argv)
export {}
