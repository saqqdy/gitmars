#!/usr/bin/env ts-node
const { program } = require('commander')
const fs = require('fs')
const sh = require('shelljs')
const inquirer = require('inquirer')
const { isGitProject } = require('./js/index')
const { error, success } = require('./js/utils/index')
const { defaults } = require('./js/global')
if (!isGitProject()) {
    sh.echo(error('当前目录不是git项目目录'))
    sh.exit(1)
}
const gitRevParse = require('./js/gitRevParse')
const { root } = gitRevParse()

import { InitInquirerPromptType } from '../typings'

/**
 * gitm init
 * @description 初始化gitmars配置
 */
program
    .name('gitm init')
    .usage('')
    .description('设置gitmars的配置项')
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
                    transformer: (val, answers, flags) => val.trim(),
                    validate: val =>
                        /^\w+$/.test(val) ? true : '请输入可用名称'
                })
            } else if (key === 'user') {
                prompts.push({
                    type: 'input',
                    name: key,
                    message: '请输入Git用户名',
                    transformer: (val, answers, flags) => val.trim(),
                    validate: val =>
                        val === '' || /^\w+$/.test(val)
                            ? true
                            : '请输入可用名称'
                })
            } else if (key === 'email') {
                prompts.push({
                    type: 'input',
                    name: key,
                    message: '请输入Git邮箱',
                    transformer: (val, answers, flags) => val.trim(),
                    validate: val =>
                        val === '' ||
                        /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(
                            val
                        )
                            ? true
                            : '请输入正确的邮箱'
                })
            } else if (key === 'nameValidator') {
                prompts.push({
                    type: 'input',
                    name: key,
                    message: '请输入分支名称命名规则',
                    transformer: (val, answers, flags) => val.trim()
                })
            } else if (key === 'descriptionValidator') {
                prompts.push({
                    type: 'input',
                    name: key,
                    message: '请输入commit信息规则',
                    transformer: (val, answers, flags) => val.trim()
                })
            } else if (key === 'msgTemplate') {
                prompts.push({
                    type: 'input',
                    name: key,
                    message: '请输入消息模板',
                    default: () => '${message}；项目：${project}；路径：${pwd}',
                    transformer: (val, answers, flags) => val.trim()
                })
            } else if (key === 'msgUrl') {
                prompts.push({
                    type: 'input',
                    name: key,
                    message: '请输入云之家消息推送地址',
                    transformer: (val, answers, flags) => val.trim(),
                    validate: val =>
                        val === '' || /^https?:\/\/[\S]*$/.test(val)
                            ? true
                            : '请输入网址'
                })
            } else if (key === 'apolloConfig') {
                prompts.push({
                    type: 'editor',
                    name: key,
                    message: '请输入apollo配置',
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
                            val = JSON.parse(val)
                            return true
                        } catch (e) {
                            return '请输入json'
                        }
                    }
                })
            } else if (key === 'hooks') {
                prompts.push({
                    type: 'editor',
                    name: key,
                    message: '请输入hooks配置',
                    default: () => `{
    "pre-commit": "",
    "pre-push": ""
}`,
                    validate: val => {
                        try {
                            val = JSON.parse(val)
                            return true
                        } catch (e) {
                            return '请输入json'
                        }
                    }
                })
            } else if (key === 'api') {
                prompts.push({
                    type: 'input',
                    name: key,
                    message: '请输入查询用户权限接口',
                    transformer: (val, answers, flags) => val.trim(),
                    validate: val =>
                        val === '' || /^https?:\/\/[\S]*$/.test(val)
                            ? true
                            : '请输入网址'
                })
            } else if (key === 'gitHost') {
                prompts.push({
                    type: 'input',
                    name: key,
                    message: '请输入git网址',
                    transformer: (val, answers, flags) => val.trim(),
                    validate: val =>
                        val === '' || /^https?:\/\/[\S]*$/.test(val)
                            ? true
                            : '请输入网址'
                })
            } else if (key === 'gitID') {
                prompts.push({
                    type: 'input',
                    name: key,
                    message: '请输入git项目ID，目前仅支持gitlab',
                    transformer: (val, answers, flags) => val.trim(),
                    validate: val =>
                        val === '' || /^\d+$/.test(val) ? true : '请输入网址'
                })
            }
        })
        inquirer.prompt(prompts).then((answers: any) => {
            try {
                answers.apolloConfig = JSON.parse(answers.apolloConfig)
                if (
                    !answers.apolloConfig.configServerUrl ||
                    !answers.apolloConfig.token
                )
                    answers.apolloConfig = ''
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
            sh.echo(success('gitmars配置成功'))
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
