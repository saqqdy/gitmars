#!/usr/bin/env ts-node
const { program } = require('commander')
const path = require('path')
const sh = require('shelljs')
const { success, warning, isGitProject } = require('./js/index')
const gitRevParse = require('./js/gitRevParse')
const cacheDir = path.join(__dirname, '../cache')
const { root, gitDir } = gitRevParse()

interface GitmBuildOption {
    force?: string
}

/**
 * gitm clean
 */
program
    .name('gitm clean')
    .usage('[-f --force]')
    .description('清理gitmars缓存')
    .option('-f, --force', '强制清理', false)
    .action((opt: GitmBuildOption): void => {
        if (isGitProject()) {
            sh.rm(gitDir + '/.gitmarscommands', gitDir + '/.gitmarslog')
            if (opt.force) {
                sh.echo(
                    warning('您输入了--force，将同时清理本地gitmars配置文件')
                )
                sh.rm(root + '/gitmarsconfig.json', root + '/.gitmarsrc')
            }
        } else {
            sh.echo(warning('当前目录不是git项目目录'))
        }
        sh.rm(cacheDir + '/buildConfig.json', cacheDir + '/buildConfig.txt', cacheDir + '/timestamp.json')
        sh.echo(success('清理完毕'))
    })
program.parse(process.argv)
export {}
