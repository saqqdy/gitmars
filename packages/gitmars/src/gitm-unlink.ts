#!/usr/bin/env ts-node
import type { GitmarsOptionOptionsType } from '../typings'
const { program } = require('commander')
const sh = require('shelljs')
const { createArgs } = require('@gitmars/core/utils/command')
const { spawnSync } = require('@gitmars/core/spawn')
const { options, args } = require('./conf/unlink')

/**
 * gitm unlink
 */
program.name('gitm unlink').usage('[name]').description('解除本地包链接')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
program.action((name: string) => {
    const isLink = sh.test('-L', `./node_modules/${name}`)
    const isExist = sh.test('-e', `./node_modules/${name}_bak`)
    const npmClient = sh.which('yarn') ? 'yarn' : 'npm'
    if (!name) {
        // 解除当前包的软链
        spawnSync(npmClient, ['unlink'])
        sh.echo('处理完成')
        process.exit(0)
    } else if (isLink) {
        // sh.rm('-rf', `./node_modules/${name}`)
        spawnSync(npmClient, ['unlink', name])
    } else {
        sh.echo('没有找到软链，请确认输入正确名称')
    }
    if (isExist) {
        sh.mv(`./node_modules/${name}_bak`, `./node_modules/${name}`)
    }
    sh.echo('处理完成')
})
program.parse(process.argv)
export {}
