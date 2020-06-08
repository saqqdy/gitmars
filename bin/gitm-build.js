#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const runJenkins = require('./src/runJenkins')
/**
 * gitm build
 */
program
	.name('gitm build')
	.usage('<project>')
	.arguments('<project>')
	.description('构建Jenkins')
	.option('-e, --env [env]', '需要构建的环境，可选dev、prod、bug、all', 'dev')
	.option('-a, --app [app]', '需要构建的应用', 'all')
	.action((project, opt) => {
		runJenkins({
			env: opt.env,
			project: project,
			app: opt.app
		})
	})
program.parse(process.argv)
