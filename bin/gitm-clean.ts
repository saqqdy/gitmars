#!/usr/bin/env ts-node
const { program } = require('commander')
const path = require('path')
const sh = require('shelljs')
const inquirer = require('inquirer')
const { options, args } = require('./conf/clean')
const { success, warning, isGitProject } = require('./js/index')
const { createArgs } = require('./js/tools')
const gitRevParse = require('./js/gitRevParse')
const cacheDir = path.join(__dirname, '../cache')
const { root, gitDir } = gitRevParse()

import { GitmarsOptionOptionsType } from '../typings'

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
// .option('-f, --force', '强制清理', false)
program.action(async (opt: GitmBuildOption) => {
    if (isGitProject()) {
        sh.rm(gitDir + '/.gitmarscommands', gitDir + '/.gitmarslog')
        if (opt.force) {
            await inquirer
                .prompt({
                    type: 'confirm',
                    name: 'value',
                    message:
                        '您输入了--force，将同时清理本地gitmars配置文件。是否继续？',
                    default: false
                })
                .then((answers: any) => {
                    if (!answers.value) {
                        sh.echo(success('已退出'))
                        sh.exit(0)
                    }
                })
            sh.rm(root + '/gitmarsconfig.json', root + '/.gitmarsrc')
        }
    } else {
        sh.echo(warning('当前目录不是git项目目录'))
    }
    sh.rm(
        cacheDir + '/buildConfig*.json',
        cacheDir + '/buildConfig.txt',
        cacheDir + '/packageInfo.json',
        cacheDir + '/timestamp.json'
    )
    sh.echo(success('清理完毕'))
})
program.parse(process.argv)
export {}
