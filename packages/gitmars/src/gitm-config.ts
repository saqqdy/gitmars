#!/usr/bin/env ts-node
const { program } = require('commander')
const sh = require('shelljs')
const { green, red } = require('chalk')
const getIsGitProject = require('@gitmars/core/lib/git/getIsGitProject')
const getGitRevParse = require('@gitmars/core/lib/git/getGitRevParse')
const { writeFile } = require('@gitmars/core/lib/utils/file')
const getConfig = require('@gitmars/core/lib/getConfig')
const { defaults } = require('./common/global')
const i18n = require('./locales')
if (!getIsGitProject()) {
    sh.echo(
        red(i18n.__('The current directory is not a git project directory'))
    )
    process.exit(1)
}
const config = getConfig()

/**
 * gitm config set
 */
program
    .name('gitm config')
    .usage('<option> [value]')
    .command('set <option> [value]')
    .description(i18n.__('Set configuration items for gitmars'))
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
            sh.echo(i18n.__('Please enter the items to be configured'))
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
    .description(i18n.__('Query single or all gitmars for configuration items'))
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
