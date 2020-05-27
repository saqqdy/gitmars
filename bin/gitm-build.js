#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { error, success, config, configFrom, queue, getCurrent, gitDir, runJenkins, runCRP } = require('./index')
/**
 * gitm build
 */
program
	.name('gitm build')
	.usage('[type]')
	.arguments('[type]')
	.description('构建Jenkins和CRP')
	.option('-e, --env [env]', '需要构建的环境，可选dev、prod、bug、all', 'dev')
	.option('-p, --project <project>', '需要构建的项目')
	.option('-a, --app [app]', '需要构建的应用', 'all')
	.action((type, opt) => {
		console.log(type, opt.project, opt.app)
		if (type && !['jenkins', 'crp'].includes(type.toLowerCase())) {
			sh.echo(error('类型不合法'))
			sh.exit(1)
			return
		}
		if (type === 'crp') {
			runCRP({
				env: opt.env,
				project: opt.project,
				app: opt.app
			})
		} else {
			runJenkins({
				env: opt.env,
				project: opt.project,
				app: opt.app
			})
		}
	})
program.parse(process.argv)
