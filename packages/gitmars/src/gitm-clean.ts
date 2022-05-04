#!/usr/bin/env ts-node
import type { GitmarsOptionOptionsType } from '../typings'
const path = require('path')
const { program } = require('commander')
const sh = require('shelljs')
const { green, yellow } = require('colors')
const inquirer = require('inquirer')
const ora = require('ora')
const getGitRevParse = require('@gitmars/core/es/git/getGitRevParse')
const getIsGitProject = require('@gitmars/core/es/git/getIsGitProject')
const { isFileExist } = require('@gitmars/core/es/utils/file')
const { createArgs } = require('@gitmars/core/es/utils/command')
const { options, args } = require('./conf/clean')
const cacheDir = path.join(__dirname, '../cache')
const { gitDir } = getGitRevParse()

sh.config.silent = true
interface GitmBuildOption {
    force?: string
}

interface GitmarsCacheFileDescriptionType {
    name?: string
    url?: string
}

/**
 * 移除文件
 *
 * @param files - 需要清理的文件数组，类型GitmarsCacheFileDescriptionType
 */
function removeFile(files: GitmarsCacheFileDescriptionType[]) {
    const spinner = ora()
    for (const file of files) {
        file.name && spinner.start(green(`正在处理${file.name}`))
        const fileExist = isFileExist(file.url)
        if (fileExist) {
            sh.rm(file.url)
            file.name && spinner.succeed(green(`${file.name}已删除`))
        } else {
            file.name && spinner.warn(green(`${file.name}未找到`))
        }
    }
    spinner.stop()
    sh.echo(green('清理完毕'))
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
    if (getIsGitProject()) {
        if (opt.force) {
            await inquirer
                .prompt({
                    type: 'confirm',
                    name: 'value',
                    message:
                        '您输入了--force，将同时清理gitmars执行缓存。是否继续？',
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
                    name: 'gitmars指令队列缓存文件',
                    url: gitDir + '/.gitmarscommands'
                },
                {
                    name: 'gitmars执行日志文件',
                    url: gitDir + '/.gitmarslog'
                }
            ])
        }
    } else {
        sh.echo(yellow('当前目录不是git项目目录'))
    }
    removeFile([
        {
            name: 'Jenkins构建配置缓存文件',
            url: cacheDir + '/buildConfig*.json'
        },
        {
            url: cacheDir + '/buildConfig.txt'
        },
        {
            name: 'Gitmars包缓存文件',
            url: cacheDir + '/packageInfo.json'
        },
        {
            name: '缓存时间Map文件',
            url: cacheDir + '/timestamp.json'
        }
    ])
})
program.parse(process.argv)
export {}
