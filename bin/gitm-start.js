#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { error, success, queue, getStatus } = require('./src/index')
const config = require('./src/config')
/**
 * gitm start
 */
program
	.name('gitm start')
	.usage('<type> <name>')
	.arguments('<type> <name>')
	.description('创建bugfix任务分支、创建feature功能开发分支、support框架支持分支')
	.action(async (type, name) => {
		const opts = ['bugfix', 'feature', 'support'] // 允许执行的指令
		let status = await getStatus()
		if (!status) sh.exit(1)
		if (opts.includes(type)) {
			// feature从release拉取，bugfix从bug拉取，support从master分支拉取
			let base = type === 'bugfix' ? config.bugfix : type === 'support' ? config.master : config.release,
				cmd = [`git fetch`, `git checkout ${base}`, `git pull`, `git checkout -b ${type}/${name} ${base}`]
			queue(cmd).then(data => {
				if (data[3].code === 0) {
					sh.echo(`${name}分支创建成功，该分支基于${base}创建，您当前已经切换到${type}/${name}\n如果需要提测，请执行${success('gitm combine ' + type + ' ' + name)}\n开发完成后，记得执行: ${success('gitm end ' + type + ' ' + name)}`)
				}
			})
		} else {
			sh.echo(error('type只允许输入：' + JSON.stringify(opts)))
			sh.exit(1)
		}
	})
program.parse(process.argv)
