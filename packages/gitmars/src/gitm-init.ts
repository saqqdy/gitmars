#!/usr/bin/env ts-node
import fs from 'fs'
import { program } from 'commander'
import chalk from 'chalk'
import sh from 'shelljs'
import inquirer from 'inquirer'
import getIsGitProject from '@gitmars/core/lib/git/getIsGitProject'
import getGitRevParse from '@gitmars/core/lib/git/getGitRevParse'
import type { InitInquirerPromptType } from '../typings'
import { defaults } from '#lib/common/global'
import i18n from '#lib/locales/index'

const { green, red } = chalk

if (!getIsGitProject()) {
    sh.echo(
        red(i18n.__('The current directory is not a git project directory'))
    )
    process.exit(1)
}
const { root } = getGitRevParse()

/**
 * gitm init
 * 初始化gitmars配置
 */
program
    .name('gitm init')
    .usage('')
    .description(i18n.__('Set configuration items for gitmars'))
    .action(() => {
        const prompts: InitInquirerPromptType[] = []
        Object.keys(defaults).forEach(key => {
            if (
                ['master', 'develop', 'release', 'bugfix', 'support'].includes(
                    key
                )
            ) {
                prompts.push({
                    type: 'input',
                    name: key,
                    message: `请输入${key}分支名称`,
                    default: () => key,
                    transformer: val => val.trim(),
                    validate: val =>
                        /^\w+$/.test(val)
                            ? true
                            : i18n.__('Please enter the available names')
                })
            } else if (key === 'user') {
                prompts.push({
                    type: 'input',
                    name: key,
                    message: i18n.__('Please enter the Git username'),
                    transformer: val => val.trim(),
                    validate: val =>
                        val === '' || /^\w+$/.test(val)
                            ? true
                            : i18n.__('Please enter the available names')
                })
            } else if (key === 'email') {
                prompts.push({
                    type: 'input',
                    name: key,
                    message: i18n.__('Please enter the Git email address'),
                    transformer: val => val.trim(),
                    validate: val =>
                        val === '' ||
                        /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(
                            val
                        )
                            ? true
                            : i18n.__('Please enter the correct email')
                })
            } else if (key === 'nameValidator') {
                prompts.push({
                    type: 'input',
                    name: key,
                    message: i18n.__(
                        'Please enter the branch name naming convention'
                    ),
                    transformer: val => val.trim()
                })
            } else if (key === 'descriptionValidator') {
                prompts.push({
                    type: 'input',
                    name: key,
                    message: i18n.__('Please enter commit message rules'),
                    transformer: val => val.trim()
                })
            } else if (key === 'msgTemplate') {
                prompts.push({
                    type: 'input',
                    name: key,
                    message: i18n.__('Please enter the message template'),
                    default: () =>
                        '${message}; project: ${project}; path: ${pwd}',
                    transformer: val => val.trim()
                })
            } else if (key === 'msgUrl') {
                prompts.push({
                    type: 'input',
                    name: key,
                    message: i18n.__('Please enter the message push address'),
                    transformer: val => val.trim(),
                    validate: val =>
                        val === '' || /^https?:\/\/[\S]*$/.test(val)
                            ? true
                            : i18n.__('Please enter the URL')
                })
            } else if (key === 'apolloConfig') {
                prompts.push({
                    type: 'editor',
                    name: key,
                    message: i18n.__('Please enter apollo configuration'),
                    default: () => `{
    "configServerUrl": "",
    "appId": "",
    "clusterName": "",
    "namespaceName": [],
    "apolloEnv": "",
    "token": ""
}`,
                    validate: val => {
                        try {
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            val = JSON.parse(val)
                            return true
                        } catch (e) {
                            return i18n.__('Please enter json')
                        }
                    }
                })
            } else if (key === 'hooks') {
                prompts.push({
                    type: 'editor',
                    name: key,
                    message: i18n.__('Please enter hooks configuration'),
                    default: () => `{
    "pre-commit": "",
    "pre-push": ""
}`,
                    validate: val => {
                        try {
                            val = JSON.parse(val)
                            return !!val
                        } catch (e) {
                            return i18n.__('Please enter json')
                        }
                    }
                })
            } else if (key === 'api') {
                prompts.push({
                    type: 'input',
                    name: key,
                    message: i18n.__(
                        'Please enter the query user permission interface'
                    ),
                    transformer: val => val.trim(),
                    validate: val =>
                        val === '' || /^https?:\/\/[\S]*$/.test(val)
                            ? true
                            : i18n.__('Please enter the URL')
                })
            } else if (key === 'gitHost') {
                prompts.push({
                    type: 'input',
                    name: key,
                    message: i18n.__('Please enter the git URL'),
                    transformer: val => val.trim(),
                    validate: val =>
                        val === '' || /^https?:\/\/[\S]*$/.test(val)
                            ? true
                            : i18n.__('Please enter the URL')
                })
            } else if (key === 'gitID') {
                prompts.push({
                    type: 'input',
                    name: key,
                    message: i18n.__(
                        'Please enter the git project ID, currently only gitlab is supported'
                    ),
                    transformer: val => val.trim(),
                    validate: val =>
                        val === '' || /^\d+$/.test(val)
                            ? true
                            : i18n.__('Please enter the URL')
                })
            }
        })
        inquirer.prompt(prompts).then((answers: any) => {
            try {
                answers.apolloConfig = JSON.parse(answers.apolloConfig)
                if (
                    !answers.apolloConfig.configServerUrl ||
                    !answers.apolloConfig.token
                ) {
                    answers.apolloConfig = ''
                }
            } catch (e) {
                answers.apolloConfig = ''
            }
            try {
                let valid = false
                answers.hooks = JSON.parse(answers.hooks)
                hooks: for (const k in answers.hooks) {
                    if (answers.hooks[k]) {
                        valid = true
                        break hooks
                    }
                }
                if (!valid) answers.hooks = ''
            } catch (e) {
                answers.hooks = ''
            }
            sh.echo(green(i18n.__('gitmars configured successfully')))
            fs.writeFileSync(
                root + '/.gitmarsrc',
                JSON.stringify(answers, null, 4),
                'utf-8'
            )
            fs.chmodSync(root + '/.gitmarsrc', 0o0755)
        })
    })
program.parse(process.argv)
export {}
