#!/usr/bin/env ts-node
import type { GitmarsOptionOptionsType } from '../typings'
const { program } = require('commander')
const sh = require('shelljs')
const { red } = require('colors')
const getIsGitProject = require('@gitmars/core/lib/git/getIsGitProject')
const { createArgs } = require('@gitmars/core/lib/utils/command')
const { spawnSync } = require('@gitmars/core/lib/spawn')
const echo = require('@gitmars/core/lib/utils/echo')
const { options, args } = require('./conf/install')
if (!getIsGitProject()) {
    sh.echo(red('当前目录不是git项目目录'))
    process.exit(1)
}

/**
 * gitm install
 */
program
    .name('gitm install')
    .usage('<pluginName>')
    .description('安装插件，例如：@gitmars/ui')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
program.action((pluginName: string) => {
    if (!pluginName) {
        echo(red('请输入插件名称'))
        process.exit(1)
    }
    const spinner = ora()
    spinner.start(green('正在安装'))
    const install = spawnSync(cmdAdd[0], cmdAdd[1], {
        stdio: 'ignore',
        shell: process.platform === 'win32'
    })
    if (install.status === 0) {
        spinner.succeed(green('安装完成'))
        // spawnSync('gitm', ['-v'], {
        //     stdio: 'inherit',
        //     shell:
        //         process.platform === 'win32'
        // })
    } else {
        spinner.fail(red('安装出错了，请联系管理员'))
    }
    spinner.stop()
    process.exit(0)
})
program.parse(process.argv)
export {}
