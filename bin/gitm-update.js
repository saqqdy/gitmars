#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { error, queue, getStatus } = require('../lib/index')
const config = require('../lib/config')
/**
 * gitm update
 */
program
	.name('gitm update')
	.usage('<type> <name>')
	.arguments('<type> <name>')
	.description('更新bug任务分支、更新feature功能开发分支、框架调整分支support')
	.option('--use-merge', '是否使用merge方式更新，默认rebase', false)
	.action(async (type, name, opt) => {
		const opts = ['bugfix', 'feature', 'support'] // 允许执行的指令
		let status = await getStatus()
		if (!status) sh.exit(1)
		if (opts.includes(type)) {
			// feature从release拉取，bugfix从bug拉取，support从master分支拉取
			let base = type === 'bugfix' ? config.bugfix : type === 'support' ? config.master : config.release,
				cmd = [`git fetch`, `git checkout ${base}`, `git pull`, `git checkout ${type}/${name}`]
			if (opt.useMerge) {
				cmd.push({
					cmd: `git merge --no-ff ${base}`,
					config: { slient: false, again: false, success: `${base}同步到${type}/${name}成功`, fail: `${base}同步到${type}/${name}出错了，请根据提示处理` }
				})
			} else {
				cmd.push({
					cmd: `git rebase ${base}`,
					config: { slient: false, again: false, success: `${base}更新到${type}/${name}成功`, fail: `${base}更新到${type}/${name}出错了，请根据提示处理` }
				})
			}
			queue(cmd)
		} else {
			sh.echo(error('type只允许输入：' + JSON.stringify(opts)))
			sh.exit(1)
		}
	})
program.parse(process.argv)
