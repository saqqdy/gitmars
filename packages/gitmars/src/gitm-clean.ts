#!/usr/bin/env ts-node
import { program } from 'commander'
import sh from 'shelljs'
import chalk from 'chalk'
import inquirer from 'inquirer'
import getGitRevParse from '@gitmars/core/lib/git/getGitRevParse'
import getIsGitProject from '@gitmars/core/lib/git/getIsGitProject'
import { removeFile } from '@gitmars/core/lib/utils/file'
import { createArgs } from '@gitmars/core/lib/utils/command'
import { cleanCache } from '@gitmars/core/lib/cache/cache'
import { cleanPkgInfo } from '@gitmars/core/lib/utils/pkgInfo'
import { cleanBuildConfig } from '@gitmars/core/lib/build/buildConfig'
import type { GitmarsOptionOptionsType } from '../typings'
import cleanConfig from '#lib/conf/clean'
import i18n from '#lib/locales/index'

sh.config.silent = true

const { green, yellow } = chalk
const { args, options } = cleanConfig
const { gitDir } = getGitRevParse()

interface GitmBuildOption {
    force?: string
}

/**
 * gitm clean
 */
program.name('gitm clean').usage('[-f --force]').description(i18n.__('Clean gitmars cache'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-f, --force', i18n.__('Force cleanup'), false)
program.action(async (opt: GitmBuildOption) => {
    if (getIsGitProject()) {
        if (opt.force) {
            await inquirer
                .prompt({
                    type: 'confirm',
                    name: 'value',
                    message: i18n.__(
                        'You have entered --force, which will also clear the gitmars execution cache. Should I continue?'
                    ),
                    default: false
                })
                .then((answers: any) => {
                    if (!answers.value) {
                        sh.echo(green(i18n.__('exited')))
                        process.exit(0)
                    }
                })
            removeFile([
                {
                    name: i18n.__('gitmars command queue cache file'),
                    url: gitDir + '/.gitmarscommands'
                },
                {
                    name: i18n.__('gitmars execution log file'),
                    url: gitDir + '/.gitmarslog'
                }
            ])
        }
    } else {
        sh.echo(
            yellow(
                i18n.__('The current directory is not a git project directory')
            )
        )
    }
    // 移除 cache/buildConfig*.json cache/buildConfig.txt
    cleanBuildConfig()
    // 移除 cache/packageInfo.json
    cleanPkgInfo()
    // 移除 cache/timestamp.json
    cleanCache()
})
program.parse(process.argv)
export {}
