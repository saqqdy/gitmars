#!/usr/bin/env ts-node
import type { GitmarsOptionOptionsType } from '../typings'
// const path = require('path')
const sh = require('shelljs')
const { yellow } = require('chalk')
const { program } = require('commander')
const { spawnSync } = require('@gitmars/core/lib/spawn')
const { createArgs } = require('@gitmars/core/lib/utils/command')
const echo = require('@gitmars/core/lib/utils/echo')
const { options, args } = require('./conf/ui')
const i18n = require('./locales')

interface GitmBuildOption {
    port?: number
}

/**
 * gitm ui
 */
program
    .name('gitm ui')
    .usage('[-p --port <port>]')
    .description(i18n.__('Link local package'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
program.action((opt: GitmBuildOption) => {
    // console.info(process.cwd(), path.join(__dirname, '../ui'), path.join(process.execPath, '../../lib/node_modules/gitmars'))
    const uiBin = sh.which('gitm-ui')?.stdout
    if (!uiBin) {
        echo(yellow('请先安装gitm ui插件：gitm install @gitmars/ui latest -m'))
        return
    }
    // const { stdout } = spawnSync('ls', ['-l', uiBin]),
    // 	gitmDir,
    // 	arr = stdout.split('->').map(el => {
    // 		el = el.trim().split(' ')
    // 		if (el.length > 1) el = el.splice(el.length - 1)
    // 		return el.join()
    // 	})
    // arr[0] = arr[0].replace(/\/gitm$/, '')
    // arr[1] = arr[1].replace(/\/(bin|lib)\/gitm.js$/, '')
    // gitmDir = path.join(...arr)
    // process.chdir(gitmDir + '/app')
    // spawnSync('pm2', ['start', 'yarn', '--name', 'server', '--', 'run', 'start'])
    // process.chdir(gitmDir + '/ui')
    // spawnSync('pm2', ['start', 'yarn', '--name', 'ui', '--', 'run', 'serve'])
    // process.chdir(path.join(__dirname, '../app'))
    // 市值启动端口号
    opt.port && (process.env.PORT = String(opt.port))
    // spawnSync('npm', ['run', 'server:start'], { stdio: 'inherit' })
    spawnSync('gitm-ui', [], { stdio: 'inherit' })
})

program.parse(process.argv)
export {}
