import sh from 'shelljs'
import chalk from 'chalk'
import request from '@jssj/request'
import type { ApolloBranchList, ApolloConfigBranchType, ApolloConfigType } from '../../typings'
import mapTemplate from '#lib/utils/mapTemplate'
import { debug } from '#lib/utils/debug'
import { getBuildConfig } from '#lib/build/buildConfig'
import lang from '#lib/lang'

const { t } = lang

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
	const buildConfig = (await getBuildConfig()) as ApolloConfigType
	const cfg: ApolloConfigBranchType = buildConfig[env]
	debug('runJenkins-buildConfig', env, project, app, buildConfig)
	if (!cfg) {
		sh.echo(chalk.red(t('Please enter the correct environment name')))
		process.exit(1)
		return
	}
	const p = cfg.list.find(el => el.name === project)
	if (!p) {
		sh.echo(chalk.red('请输入正确的项目名称'))
		process.exit(1)
		return
	}
	if (app && p.apps) {
		const appList = app.split(',')
		for (const item of appList) {
			if (!p.apps.includes(item)) {
				sh.echo(chalk.red(t('Please enter the correct application name')))
				process.exit(1)
				return
			}
		}
	}
	if (!buildConfig.template) {
		sh.echo(chalk.red(t('Please configure the Jenkins build address template')))
		process.exit(1)
		return
	}
	const url = mapTemplate(
		p.apps && p.apps.length > 0 ? buildConfig.templateWithParam : buildConfig.template,
		{
			line: cfg.line,
			project: p.project,
			token: cfg.token,
			app
		}
	)
	const auth = `Basic ${Buffer.from(buildConfig.username + ':' + buildConfig.password).toString(
		'base64'
	)}`
	await request
		.get({
			url,
			headers: { Authorization: auth }
		})
		.then(() => {
			sh.echo(chalk.green(t('Successfully pulled up Jenkins build')))
		})
}

export default runJenkins
