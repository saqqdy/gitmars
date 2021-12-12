const sh = require('shelljs')
const { green, red } = require('colors')
const request = require('../request')
const getApolloConfig = require('./getApolloConfig')
const mapTemplate = require('../utils/mapTemplate')
const { debug } = require('../utils/debug')

import type {
    ApolloConfigType,
    ApolloConfigBranchType,
    ApolloBranchList
} from '../../../typings'

export interface RunJenkinsOptionType {
    env: ApolloBranchList
    project: string
    app: string
}

/**
 * 调起Jenkins构建
 *
 * @param option - 配置
 */
async function runJenkins({
    env,
    project,
    app = 'all'
}: RunJenkinsOptionType): Promise<void | unknown> {
    const buildConfig = (await getApolloConfig()) as ApolloConfigType
    const cfg: ApolloConfigBranchType = buildConfig[env]
    debug('runJenkins-buildConfig', env, project, app, buildConfig)
    if (!cfg) {
        sh.echo(red('请输入正确的环境名称'))
        process.exit(1)
        return
    }
    const p = cfg.list.find(el => el.name === project)
    if (!p) {
        sh.echo(red('请输入正确的项目名称'))
        process.exit(1)
        return
    }
    if (app && p.apps) {
        const appList = app.split(',')
        for (const item of appList) {
            if (!p.apps.includes(item)) {
                sh.echo(red('请输入正确的应用名称'))
                process.exit(1)
                return
            }
        }
    }
    if (!buildConfig.template) {
        sh.echo(red('请配置Jenkins构建地址模板'))
        process.exit(1)
        return
    }
    const url = mapTemplate(
        p.apps && p.apps.length > 0
            ? buildConfig.templateWithParam
            : buildConfig.template,
        {
            line: cfg.line,
            project: p.project,
            token: cfg.token,
            app
        }
    )
    const auth = `Basic ${Buffer.from(
        buildConfig.username + ':' + buildConfig.password
    ).toString('base64')}`
    await request
        .get({
            url,
            headers: { Authorization: auth }
        })
        .then(() => {
            sh.echo(green('成功调起Jenkins构建'))
        })
}

module.exports = runJenkins
export {}
