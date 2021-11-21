#!/usr/bin/env ts-node
const { program } = require('commander')
const path = require('path')
const sh = require('shelljs')
const inquirer = require('inquirer')
const ora = require('ora')
const { options, args } = require('./conf/clean')
const { getIsGitProject } = require('./core/git/index')
const {
    success,
    warning,
    isFileExist,
    createArgs
} = require('./core/utils/index')
const gitRevParse = require('./core/gitRevParse')
const cacheDir = path.join(__dirname, '../cache')
const { gitDir } = gitRevParse()

sh.config.silent = true

import { GitmarsOptionOptionsType } from '../typings'

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
        file.name && spinner.start(success(`正在处理${file.name}`))
        const fileExist = isFileExist(file.url)
        if (fileExist) {
            sh.rm(file.url)
            file.name && spinner.succeed(success(`${file.name}已删除`))
        } else {
            file.name && spinner.warn(success(`${file.name}未找到`))
        }
    }
    spinner.stop()
    sh.echo(success('清理完毕'))
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
                        sh.echo(success('已退出'))
                        sh.exit(0)
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
        sh.echo(warning('当前目录不是git项目目录'))
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
