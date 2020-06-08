const sh = require('shelljs')
const apolloConfig = require('./apollo')
const { success, mapTemplate } = require('./index')
/**
 * runJenkins
 * @description 调起Jenkins构建
 */
module.exports = async function runJenkins({ env, project, app = 'all' }) {
	let buildConfig = await apolloConfig(),
		cfg = buildConfig[env],
		p,
		url
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
	url = mapTemplate(buildConfig.template, {
		line: cfg.line,
		project: p.project,
		token: cfg.token,
		app: app
	})
	sh.exec(`curl -u ${buildConfig.username}:${buildConfig.password} "${url}"`, { silent: true })
	sh.echo(success('成功调起Jenkins构建'))
}
