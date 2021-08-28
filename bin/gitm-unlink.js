#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { options, args } = require('./conf/unlink')
const { createArgs } = require('./js/tools')
/**
 * gitm unlink
 */
program.name('gitm unlink').usage('[name]').description('解除本地包链接')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach(o => {
    program.option(o.flags, o.description, o.defaultValue)
})
program.action(name => {
    let isLink = sh.test('-L', `./node_modules/${name}`),
        isExist = sh.test('-e', `./node_modules/${name}_bak`),
        npmClient = sh.which('yarn') ? 'yarn' : 'npm'
    if (!name) {
        // 解除当前包的软链
        sh.exec(`${npmClient} unlink`, { silent: true })
        sh.echo('处理完成')
        sh.exit(0)
    } else if (isLink) {
        // sh.rm('-rf', `./node_modules/${name}`)
        sh.exec(`${npmClient} unlink ${name}`, { silent: true })
    } else {
        sh.echo('没有找到软链，请确认输入正确名称')
    }
    if (isExist) {
        sh.mv(`./node_modules/${name}_bak`, `./node_modules/${name}`)
    }
    sh.echo('处理完成')
})
program.parse(process.argv)
