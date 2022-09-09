#!/usr/bin/env ts-node
import { program } from 'commander'
import sh from 'shelljs'
import chalk from 'chalk'
import getCurrentBranch from '@gitmars/core/lib/git/getCurrentBranch'
import { spawnSync } from '@gitmars/core/lib/spawn'
import getConfig from '@gitmars/core/lib/getConfig'
import i18n from '#lib/locales/index'

const { red } = chalk
const config = getConfig()

interface GitmBuildOption {
    noVerify?: boolean
    dev?: boolean
    release?: boolean
}

/**
 * gitm permission
 */
program
    .name('gitm permission')
    .usage('[message] [--no-verify] [--dev] [--release]')
    .arguments('[message]')
    .description(i18n.__('Verify commit permissions'))
    .option(
        '--no-verify',
        i18n.__('Do you want to skip the check permission'),
        false
    )
    .option('--dev', '是否限制dev提交', false)
    .option('--release', '是否限制release提交', false)
    .action((message: string, opt: GitmBuildOption) => {
        console.info('gitm permission is running')
        const current = getCurrentBranch()
        const allow = [config.master]
        const { stdout } = spawnSync('git', ['show'])
        if (opt.dev) allow.push(config.develop)
        if (opt.release) allow.push(config.release)
        const index = allow.indexOf(current)
        if (
            index > -1 &&
            !opt.noVerify &&
            stdout &&
            !stdout.includes('Merge:') &&
            !stdout.includes('Merge branch')
        ) {
            sh.echo(red(`${allow[index]}分支不允许直接提交`))
            process.exit(1)
        } else {
            process.exit(0)
        }
        // sh.echo(process.env.HUSKY_GIT_PARAMS)
        // sh.echo(process.env.FORCE_COMMIT)
    })
program.parse(process.argv)
export {}
