#!/usr/bin/env ts-node
import { program } from 'commander'
import sh from 'shelljs'
import { createArgs } from '@gitmars/core/lib/utils/command'
import { spawnSync } from '@gitmars/core/lib/spawn'
import type { GitmarsOptionOptionsType } from '../typings'
import lang from '#lib/common/local'
import unlinkConfig from '#lib/conf/unlink'

const { t } = lang
const { args, options } = unlinkConfig

/**
 * gitm unlink
 */
program.name('gitm unlink').usage('[name]').description(t('Unlinking local package'))
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
        sh.echo(t('Processing completed'))
        process.exit(0)
    } else if (isLink) {
        // sh.rm('-rf', `./node_modules/${name}`)
        spawnSync(npmClient, ['unlink', name])
    } else {
        sh.echo(t('No softlink found, please confirm entering the correct name'))
    }
    if (isExist) {
        sh.mv(`./node_modules/${name}_bak`, `./node_modules/${name}`)
    }
    sh.echo(t('Processing completed'))
})
program.parse(process.argv)
export {}
