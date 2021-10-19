#!/usr/bin/env ts-node
const { program } = require('commander')
const sh = require('shelljs')
const { options, args } = require('./conf/link')
const { createArgs } = require('./js/tools')

import { GitmarsOptionOptionsType } from '../typings'

/**
 * gitm link
 */
program.name('gitm link').usage('[name]').description('链接本地包')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
program.action((name: string) => {
    // path = path.replace(/\\/g, '/')
    const isLink = sh.test('-L', `./node_modules/${name}`)
    const isExist = sh.test('-e', `./node_modules/${name}`)
    const npmClient = sh.which('yarn') ? 'yarn' : 'npm'
    if (!name) {
        // 给当前包创建软链
        const { code } = sh.exec(`${npmClient} link`, { silent: true })
        if (code === 0) sh.echo('处理完成')
        else sh.echo('出错了')
        sh.exit(0)
    } else if (isLink) {
        sh.rm('-rf', `./node_modules/${name}`)
    } else if (isExist) {
        sh.mv(`./node_modules/${name}`, `./node_modules/${name}_bak`)
    }
    // sh.ln('-s', path, `./node_modules/${name}`)
    const { code } = sh.exec(`${npmClient} link ${name}`, { silent: true })
    if (code === 0) sh.echo('处理完成')
    else
        sh.echo(
            `处理失败，${name}软链不存在，请进入本地${name}根目录执行：gitm link`
        )
})
program.parse(process.argv)
export {}
