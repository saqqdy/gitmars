#!/usr/bin/env ts-node
import type { GitmarsOptionOptionsType, PackageVersionTag } from '../typings'
const { program } = require('commander')
const ora = require('ora')
const { red, green } = require('chalk')
const { createArgs } = require('@gitmars/core/lib/utils/command')
const { spawnSync } = require('@gitmars/core/lib/spawn')
const echo = require('@gitmars/core/lib/utils/echo')
const { options, args } = require('./conf/install')

interface GitmBuildOption {
    mirror?: boolean
    client?: 'npm' | 'yarn' | 'pnpm' | 'cnpm' | string
    registry?: string
}

/**
 * gitm install
 */
program
    .name('gitm install')
    .usage(
        '<pluginName> [version] [-m --mirror] [-c --client [client]] [-r --registry <registry>]'
    )
    .description('安装插件，例如：@gitmars/ui')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-m, --mirror', '是否使用淘宝镜像', false)
// .option('-c, --client [client]', '用于装包的客户端名称', 'npm')
// .option('-r, --registry <registry]>', '使用镜像地址', '')
program.action(
    (
        pluginName: string,
        version: PackageVersionTag | string,
        opt: GitmBuildOption
    ) => {
        if (!pluginName) {
            echo(red('请输入插件名称'))
            process.exit(1)
        }
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
        let cmdAdd: [GitmBuildOption['client'], string[]]
        switch (opt.client) {
            case 'yarn':
                cmdAdd = [
                    opt.client,
                    ['global', 'add', `${pluginName}@${version}`]
                ]
                break
            case 'pnpm':
                cmdAdd = [opt.client, ['add', '-g', `${pluginName}@${version}`]]
                break
            default:
                // default npm or cnpm
                cmdAdd = [
                    opt.client,
                    ['install', '-g', `${pluginName}@${version}`]
                ]
                break
        }
        // 这一行后面准备删掉
        if (!opt.registry && opt.mirror) {
            opt.registry = 'https://registry.npmmirror.com'
        }
        if (opt.registry) {
            cmdAdd[1] = cmdAdd[1].concat(['-registry', opt.registry])
        }
        spinner.start(green('正在安装'))
        const install = spawnSync(...cmdAdd, {
            stdio: 'ignore',
            shell: process.platform === 'win32'
        })
        if (install.status === 0) {
            spinner.succeed(green('安装完成'))
        } else {
            spinner.fail(red('安装出错了，请联系管理员'))
        }
        spinner.stop()
        process.exit(0)
    }
)
program.parse(process.argv)
export {}
