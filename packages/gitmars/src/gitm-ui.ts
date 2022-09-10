#!/usr/bin/env ts-node
// import { dirname, join } from 'path'
// import { fileURLToPath } from 'url'
import sh from 'shelljs'
import chalk from 'chalk'
import { program } from 'commander'
import { spawnSync } from '@gitmars/core/lib/spawn'
import { createArgs } from '@gitmars/core/lib/utils/command'
import echo from '@gitmars/core/lib/utils/echo'
import type { GitmarsOptionOptionsType } from '../typings'
import uiConfig from '#lib/conf/ui'
import i18n from '#lib/locales/index'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)
const { yellow } = chalk
const { args, options } = uiConfig

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
        echo(
            yellow(
                i18n.__(
                    'Please install the gitm ui plugin first: gitm install @gitmars/ui latest -m'
                )
            )
        )
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
    // arr[1] = arr[1].replace(/\/(bin|lib)\/gitm.mjs$/, '')
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
