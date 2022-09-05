#!/usr/bin/env ts-node
const { program } = require('commander')
const sh = require('shelljs')
const { green, red } = require('chalk')
const getIsGitProject = require('@gitmars/core/lib/git/getIsGitProject')
const getGitRevParse = require('@gitmars/core/lib/git/getGitRevParse')
const { writeFile } = require('@gitmars/core/lib/utils/file')
const { defaults } = require('@gitmars/core/lib/global')
const i18n = require('./locales')
if (!getIsGitProject()) {
    sh.echo(
        red(i18n.__('The current directory is not a git project directory'))
    )
    process.exit(1)
}
const getConfig = require('@gitmars/core/lib/getConfig')
const config = getConfig()

/**
 * gitm config set
 */
program
    .name('gitm config')
    .usage('<option> [value]')
    .command('set <option> [value]')
    .description('设置gitmars的配置项')
    .action(async (option: string, value: string): Promise<void> => {
        let { filepath } = config
        if (!filepath) {
            const { root } = getGitRevParse()
            filepath = root + '/.gitmarsrc'
        }
        if (value) {
            if (Object.keys(defaults).includes(option)) {
                config[option] = value
                delete config.filepath
                delete config.skipCI
                await writeFile(filepath, JSON.stringify(config, null, 4))
                sh.echo(green('保存成功'))
                process.exit(0)
            } else {
                sh.echo(red('不支持' + option + '这个配置项'))
                process.exit(1)
            }
        } else {
            sh.echo('请输入要配置的项')
            process.exit(1)
        }
    })
/**
 * gitm config list
 */
program
    .name('gitm config')
    .usage('list [option]')
    .command('list [option]')
    .description('查询单个或全部gitmars的配置项')
    .action((option: string): void => {
        if (option) {
            sh.echo(green(config[option]))
        } else {
            sh.echo(green(config))
        }
        process.exit(0)
    })
program.parse(process.argv)
export {}
