#!/usr/bin/env ts-node
import { program } from 'commander'
import chalk from 'chalk'
import { createArgs } from '@gitmars/core/lib/utils/command'
import { spawnSync } from '@gitmars/core/lib/spawn'
import echo from '@gitmars/core/lib/utils/echo'
import type { GitmarsOptionOptionsType } from '../typings'
import aliasConfig from '#lib/conf/alias'
import i18n from '#lib/locales/index'

const { red } = chalk
const { args, options } = aliasConfig
const actions = ['init', 'remove'] as const
type Module = typeof actions[number]
interface Action {
    (): void
}

/**
 * gitm alias
 */
program
    .name('gitm alias')
    .usage('<action>')
    .description(i18n.__('Install and remove shortcuts'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
program.action((action: Module) => {
    if (!actions.includes(action)) {
        echo(
            red(
                i18n.__(
                    'The method you entered is incorrect, only support: init, remove'
                )
            )
        )
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
