#!/usr/bin/env ts-node
import type { GitmarsOptionOptionsType } from '../typings'
const path = require('path')
const { program } = require('commander')
const { spawnSync } = require('@gitmars/core/spawn')
const { createArgs } = require('@gitmars/core/utils/command')
const { options, args } = require('./conf/ui')

interface GitmBuildOption {
    port?: number
}

/**
 * gitm ui
 */
program.name('gitm ui').usage('[-p --port <port>]').description('链接本地包')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
program.action((opt: GitmBuildOption) => {
    // console.info(process.cwd(), path.join(__dirname, '../ui'), path.join(process.execPath, '../../lib/node_modules/gitmars'))
    // const { stdout } = spawnSync('ls', ['-l', sh.which('gitm').stdout]),
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
    process.chdir(path.join(__dirname, '../app'))
    // 市值启动端口号
    opt.port && (process.env.PORT = String(opt.port))
    spawnSync('npm', ['run', 'server:start'], { stdio: 'inherit' })
})

program.parse(process.argv)
export {}
