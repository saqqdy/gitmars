const sh = require('shelljs')
const apolloConfig = require('./apollo')
const { error, success, mapTemplate } = require('./index')

import type { ApolloConfigType, ApolloConfigBranchType, ApolloBranchList } from '../../typings'

export interface RunJenkinsOptionType {
    env: ApolloBranchList
    project: string
    app: string
}

/**
 * runJenkins
 * @description 调起Jenkins构建
 */
async function runJenkins({ env, project, app = 'all' }: RunJenkinsOptionType): Promise<void | unknown> {
    const buildConfig = (await apolloConfig()) as ApolloConfigType
    const cfg: ApolloConfigBranchType = buildConfig[env]
    let p
    if (!cfg) {
        sh.echo(error('请输入正确的环境名称'))
        sh.exit(1)
        return
    }
    p = cfg.list.find(el => el.name === project)
    if (!p) {
        sh.echo(error('请输入正确的项目名称'))
        sh.exit(1)
        return
    }
    if (app && p.apps && !p.apps.includes(app)) {
        sh.echo(error('请输入正确的应用名称'))
        sh.exit(1)
        return
    }
    if (!buildConfig.template) {
        sh.echo(error('请配置Jenkins构建地址模板'))
        sh.exit(1)
        return
    }
    const url = mapTemplate(p.apps && p.apps.length > 0 ? buildConfig.templateWithParam : buildConfig.template, {
        line: cfg.line,
        project: p.project,
        token: cfg.token,
        app
    })
    sh.exec(`curl -u ${buildConfig.username}:${buildConfig.password} "${url}"`, { silent: true })
    sh.echo(success('成功调起Jenkins构建'))
}

module.exports = runJenkins
