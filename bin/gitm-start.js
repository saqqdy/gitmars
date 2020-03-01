#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { warning, success, config, configFrom, queue, getStatus, pwd } = require('./index')
/**
 * gitm start
 */
program
	.name('gitm start')
	.usage('<type> <name>')
	.arguments('<type> <name>')
	.description('创建bugfix任务分支、创建feature功能开发分支')
	.action(async (type, name) => {
		const opts = ['bugfix', 'feature'] // 允许执行的指令
		let status = await getStatus()
		if (opts.includes(type) && status) {
			// feature从release拉取，bugfix从bug拉取
			let base = type === 'bugfix' ? config.bugfix : config.release,
				cmd = [`cd ${pwd}`, `git checkout -b ${type}/${name} ${base}`]
			queue(cmd)
				.then(data => {
					if (data[1].code === 0) {
						sh.echo(`${name}分支创建成功，该分支基于${base}创建，您当前已经切换到${type}/${name}\n如果需要提测，请执行${success('gitm combine ' + type + ' ' + name)}\n开发完成后，记得执行: ${success('gitm end ' + type + ' ' + name)}`)
					}
				})
				.catch(err => {
					sh.echo(warning('指令 ' + err.cmd + ' 执行失败，请联系管理员'))
				})
		} else {
			sh.echo(warning('type只允许输入：' + JSON.stringify(opts)))
			sh.exit(1)
		}
	})
program.parse(process.argv)
