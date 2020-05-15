#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { error, success, config, configFrom, queue, getCurrent, gitDir } = require('./index')
/**
 * gitm permission
 */
program
	.name('gitm permission')
	.usage('')
	.arguments('[message]')
	.description('校验提交权限')
	.option('--no-verify', '是否需要跳过校验权限', false)
	.action(async (message, opt) => {
		const current = await getCurrent()
		let msg = sh.cat(gitDir + '/COMMIT_EDITMSG').stdout.split('\n')[0]
		// sh.echo(process.env.HUSKY_GIT_PARAMS)
		// sh.echo(process.env.FORCE_COMMIT)
		if (current === config.master && !opt.noVerify && msg && !/^Merge\s+branch/.test(msg)) {
			sh.echo(error(`${config.master}分支不允许直接提交`))
			sh.exit(1)
		} else {
			sh.exit(0)
		}
	})
program.parse(process.argv)
