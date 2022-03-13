#!/usr/bin/env ts-node
const { program } = require('commander')
const sh = require('shelljs')
const { red } = require('colors')
const { options, args } = require('./conf/shortcut')
const getIsGitProject = require('./core/git/getIsGitProject')
const { createArgs } = require('./core/utils/command')
const { spawnSync } = require('./core/spawn')
const echo = require('./core/utils/echo')
if (!getIsGitProject()) {
    sh.echo(red('当前目录不是git项目目录'))
    process.exit(1)
}

import { GitmarsOptionOptionsType } from '../typings'

const actions = ['init', 'remove'] as const
type Module = typeof actions[number]
interface Action {
    (): void
}

/**
 * gitm shortcut
 */
program
    .name('gitm shortcut')
    .usage('<action>')
    .description('安装和移除快捷方式')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
program.action((action: Module) => {
    if (!actions.includes(action)) {
        echo(red('您输入的方法不对，仅支持：init, remove'))
        process.exit(1)
    }
    const alias = {
        flow: '!gitm',
        mars: '!gitm',
        unstage: 'reset HEAD --',
        last: 'log -1 HEAD',
        st: 'status',
        cm: 'commit',
        br: 'branch',
        bh: 'branch',
        ck: 'checkout',
        ckb: 'checkout -b',
        cp: 'cherry-pick',
        ps: 'push',
        pl: 'pull',
        plm: 'pull --merge',
        plr: 'pull --rebase',
        fh: 'fetch',
        sh: 'stash',
        shp: 'stash pop',
        sha: 'stash apply',
        mg: 'merge',
        mgn: 'merge --no-ff',
        rs: 'reset',
        rsh: 'reset --hard',
        rss: 'reset --soft',
        rb: 'rebase'
    } as const
    type Short = keyof typeof alias

    const cmd: Record<Module, Action> = {
        init: () => {
            for (const short in alias) {
                spawnSync('git', [
                    'config',
                    '--global',
                    `alias.${short}`,
                    alias[short as Short]
                ])
            }
        },
        remove: () => {
            for (const short in alias) {
                spawnSync('git', [
                    'config',
                    '--global',
                    '--unset',
                    `alias.${short}`
                ])
            }
        }
    }
    cmd[action]()
})
program.parse(process.argv)
export {}
