#!/usr/bin/env ts-node
import type { GitmarsOptionOptionsType } from '../typings'
const { program } = require('commander')
const sh = require('shelljs')
const { green, yellow } = require('chalk')
const inquirer = require('inquirer')
const getGitRevParse = require('@gitmars/core/lib/git/getGitRevParse')
const getIsGitProject = require('@gitmars/core/lib/git/getIsGitProject')
const { removeFile } = require('@gitmars/core/lib/utils/file')
const { createArgs } = require('@gitmars/core/lib/utils/command')
const { cleanCache } = require('@gitmars/core/lib/cache/cache')
const { cleanPkgInfo } = require('@gitmars/core/lib/utils/pkgInfo')
const { cleanBuildConfig } = require('@gitmars/core/lib/build/buildConfig')
const { options, args } = require('./conf/clean')
const { gitDir } = getGitRevParse()
const i18n = require('./locales')

sh.config.silent = true
interface GitmBuildOption {
    force?: string
}

/**
 * gitm clean
 */
program.name('gitm clean').usage('[-f --force]').description('清理gitmars缓存')
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
                        sh.echo(green('已退出'))
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
