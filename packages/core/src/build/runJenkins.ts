import sh from 'shelljs'
import chalk from 'chalk'
import request from '@jssj/request'
import { mapTemplate } from 'js-cool'
import type { ApolloBranchList, ApolloConfigBranchType, ApolloConfigType } from '../../typings/core'
import { debug } from '#lib/utils/debug'
import { getBuildConfig } from '#lib/build/buildConfig'
import lang from '#lib/lang'

const { t } = lang

export interface RunJenkinsOptionType {
	env: ApolloBranchList
	project: string
	app: string
	data?: string
}

/**
 * 调起Jenkins构建
 *
 * @param option - 配置
 */
async function runJenkins({
	env,
	project,
	app = 'all',
	data
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
		sh.echo(chalk.red('Please enter the correct project name'))
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
	const url = new URL(
		mapTemplate(
			p.apps && p.apps.length > 0 ? buildConfig.templateWithParam : buildConfig.template,
			{
				line: cfg.line,
				project: p.project,
				token: cfg.token,
				app
			}
		)
	)
	const auth = `Basic ${Buffer.from(buildConfig.username + ':' + buildConfig.password).toString(
		'base64'
	)}`

	if (data) {
		try {
			const _data = JSON.parse(data)
			for (const key in _data) {
				url.searchParams.append(key, _data[key])
			}
		} catch {}
	}

	await request
		.get({
			url: url.toString(),
			headers: { Authorization: auth }
		})
		.then(() => {
			sh.echo(chalk.green(t('Successfully pulled up Jenkins build')))
		})
}

export default runJenkins
