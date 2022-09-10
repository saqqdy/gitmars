#!/usr/bin/env ts-node
import { program } from 'commander'
import sh from 'shelljs'
import chalk from 'chalk'
import getIsGitProject from '@gitmars/core/lib/git/getIsGitProject'
import getGitRevParse from '@gitmars/core/lib/git/getGitRevParse'
import { writeFile } from '@gitmars/core/lib/utils/file'
import getConfig from '@gitmars/core/lib/getConfig'
import { defaults } from '#lib/common/global'
import i18n from '#lib/locales/index'

const { green, red } = chalk
const config = getConfig()

if (!getIsGitProject()) {
    sh.echo(
        red(i18n.__('The current directory is not a git project directory'))
    )
    process.exit(1)
}

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
                sh.echo(green(i18n.__('Saved successfully')))
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
