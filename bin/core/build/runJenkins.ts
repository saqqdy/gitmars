const sh = require('shelljs')
const request = require('../request')
const getApolloConfig = require('./getApolloConfig')
const mapTemplate = require('../utils/mapTemplate')
const { error, success } = require('../utils/colors')

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
    if (!cfg) {
        sh.echo(error('请输入正确的环境名称'))
        sh.exit(1)
        return
    }
    const p = cfg.list.find(el => el.name === project)
    if (!p) {
        sh.echo(error('请输入正确的项目名称'))
        sh.exit(1)
        return
    }
    if (app && p.apps) {
        const appList = app.split(',')
        for (const item of appList) {
            if (!p.apps.includes(item)) {
                sh.echo(error('请输入正确的应用名称'))
                sh.exit(1)
                return
            }
        }
    }
    if (!buildConfig.template) {
        sh.echo(error('请配置Jenkins构建地址模板'))
        sh.exit(1)
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
    // await request
    //     .get({
    //         url: 'http://tdeploy:tdeploy@deploy.wojiayun.cn/view/git_bug/job/git_wjweb_bug/buildWithParameters?token=wojiayunbug&build_app=all',
    //         data: {
    //             username: buildConfig.username,
    //             password: buildConfig.password
    //         }
    //     })
    //     .then(() => {
    //         sh.echo(success('成功调起Jenkins构建'))
    //     })
    sh.exec(
        `curl -u ${buildConfig.username}:${buildConfig.password} "${url}"`,
        { silent: true }
    )
    sh.echo(success('成功调起Jenkins构建'))
}

module.exports = runJenkins
export {}
