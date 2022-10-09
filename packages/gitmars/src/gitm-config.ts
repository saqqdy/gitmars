#!/usr/bin/env ts-node
import { program } from 'commander'
import sh from 'shelljs'
import chalk from 'chalk'
import getIsGitProject from '@gitmars/core/lib/git/getIsGitProject'
import getGitRevParse from '@gitmars/core/lib/git/getGitRevParse'
import { writeFile } from '@gitmars/core/lib/utils/file'
import getConfig from '@gitmars/core/lib/getConfig'
import type { GitmarsConfigProperty } from '@gitmars/core/typings/index'
import lang from '#lib/common/local'
import { defaults } from '#lib/common/global'

const { t } = lang
const { green, red } = chalk
const config: any = getConfig()

if (!getIsGitProject()) {
    sh.echo(red(t('The current directory is not a git project directory')))
    process.exit(1)
}

/**
 * gitm config set
 */
program
    .name('gitm config')
    .usage('<option> [value]')
    .command('set <option> [value]')
    .description(t('Set configuration items for gitmars'))
    .action(
        async (option: any, value: string): Promise<void> => {
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
                    sh.echo(green(t('Saved successfully')))
                    process.exit(0)
                } else {
                    sh.echo(
                        red(
                            t(
                                'The configuration item {option} is not supported',
                                {
                                    option
                                }
                            )
                        )
                    )
                    process.exit(1)
                }
            } else {
                sh.echo(t('Please enter the items to be configured'))
                process.exit(1)
            }
        }
    )
/**
 * gitm config list
 */
program
    .name('gitm config')
    .usage('list [option]')
    .command('list [option]')
    .description(t('Query single or all gitmars for configuration items'))
    .action((option: GitmarsConfigProperty): void => {
        if (option) {
            sh.echo(green(config[option]))
        } else {
            sh.echo(green(config))
        }
        process.exit(0)
    })
program.parse(process.argv)
export {}
