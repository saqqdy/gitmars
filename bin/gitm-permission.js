#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { error, getCurrent } = require('./js/index')
const config = require('./js/config')
/**
 * gitm permission
 */
program
	.name('gitm permission')
	.usage('[message]')
	.arguments('[message]')
	.description('校验提交权限')
	.option('--no-verify', '是否需要跳过校验权限', false)
	.option('--dev', '是否限制dev提交', false)
	.option('--release', '是否限制release提交', false)
	.action((message, opt) => {
		const current = getCurrent()
		let allow = [config.master],
			msg = sh.exec('git show', { silent: true }).stdout,
			index
		if (opt.dev) allow.push(config.develop)
		if (opt.release) allow.push(config.release)
		index = allow.indexOf(current)
		if (index > -1 && !opt.noVerify && msg && msg.indexOf('Merge:') === -1 && msg.indexOf('Merge branch') === -1) {
			sh.echo(error(`${allow[index]}分支不允许直接提交`))
			sh.exit(1)
		} else {
			sh.exit(0)
		}
		// sh.echo(process.env.HUSKY_GIT_PARAMS)
		// sh.echo(process.env.FORCE_COMMIT)
	})
program.parse(process.argv)
