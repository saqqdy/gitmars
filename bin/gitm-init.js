#!/usr/bin/env node
/* eslint-disable no-unused-vars */
const fs = require('fs')
const path = require('path')
const program = require('commander')
const sh = require('shelljs')
const inquirer = require('inquirer')
const { success } = require('./js/index')
const { defaults } = require('./js/global')
const { root } = require('./js/gitRevParse')()
/**
 * gitm init
 * @description 初始化gitmars配置
 */
program
    .name('gitm init')
    .usage('')
    .description('设置gitmars的配置项')
    .action(() => {
        let prompts = []
        Object.keys(defaults).forEach(key => {
            if (['master', 'develop', 'release', 'bugfix', 'support'].includes(key)) {
                prompts.push({
                    type: 'input',
                    name: key,
                    message: `请输入${key}分支名称`,
                    default: () => key,
                    transformer: (val, answers, flags) => val.trim(),
                    validate: val => (/^\w+$/.test(val) ? true : '请输入可用名称')
                })
            } else if (key === 'user') {
                prompts.push({
                    type: 'input',
                    name: key,
                    message: `请输入Git用户名`,
                    transformer: (val, answers, flags) => val.trim(),
                    validate: val => (val === '' || /^\w+$/.test(val) ? true : '请输入可用名称')
                })
            } else if (key === 'email') {
                prompts.push({
                    type: 'input',
                    name: key,
                    message: `请输入Git邮箱`,
                    transformer: (val, answers, flags) => val.trim(),
                    validate: val => (val === '' || /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(val) ? true : '请输入正确的邮箱')
                })
            } else if (key === 'msgTemplate') {
                prompts.push({
                    type: 'input',
                    name: key,
                    message: `请输入消息模板`,
                    default: () => '${message}；项目：${project}；路径：${pwd}',
                    transformer: (val, answers, flags) => val.trim()
                })
            } else if (key === 'msgUrl') {
                prompts.push({
                    type: 'input',
                    name: key,
                    message: `请输入云之家消息推送地址`,
                    transformer: (val, answers, flags) => val.trim(),
                    validate: val => (val === '' || /^https?:\/\/[\S]*$/.test(val) ? true : '请输入网址')
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
            }
        })
        inquirer.prompt(prompts).then(answers => {
            try {
                answers.apolloConfig = JSON.parse(answers.apolloConfig)
                if (!answers.apolloConfig.configServerUrl || !answers.apolloConfig.token) answers.apolloConfig = ''
            } catch (e) {
                answers.apolloConfig = ''
            }
            try {
                let valid = false
                answers.hooks = JSON.parse(answers.hooks)
                hooks: for (let k in answers.hooks) {
                    if (!!answers.hooks[k]) {
                        valid = true
                        break hooks
                    }
                }
                if (!valid) answers.hooks = ''
            } catch (e) {
                answers.hooks = ''
            }
            sh.echo(success('gitmars配置成功'))
            fs.writeFileSync(root + '/.gitmarsrc', JSON.stringify(answers, null, 4), 'utf-8')
            fs.chmodSync(root + '/.gitmarsrc', 0o0755)
        })
    })
program.parse(process.argv)
