#!/usr/bin/env node
const program = require('commander')
const shell = require('shelljs')
const { warning, success, defaults, config, configFrom, wait, queue, pwd } = require('./index')
/**
 * gitm start
 */
program
	.name('gitm start')
	.usage('<type> <name>')
	.arguments('<type> <name>')
	.description('创建bugfix任务分支、创建feature功能开发分支')
	.action((type, name) => {
		const opts = ['bugfix', 'release'] // 允许执行的指令
		if (configFrom === 0) {
			shell.echo(warning('您还没有初始化项目\n请先执行: gitm init'))
			shell.exit(1)
		}
		if (opts.includes(type)) {
			queue(['git status']).then(d => {
				if (d.out.indexOf('Changes to be committed') > -1 || d.out.indexOf('Changes not staged for commit') > -1) {
					shell.echo(warning('您还有未提交的文件，请处理后再继续') + '\n如果需要暂存文件请执行: gitm save\n恢复时执行：gitm get')
					shell.exit(1)
				} else if (d.out.indexOf('Untracked files') > -1) {
					shell.echo(warning('您还有未加入版本的文件，请处理后再继续') + '\n如果需要暂存文件请执行: gitm save --force\n恢复时执行：gitm get')
					shell.exit(1)
				} else {
					// feature从release拉取，bugfix从bug拉取
					let base = type === 'bugfix' ? config.bugfix : config.release,
						cmd = [`cd ${pwd}`, `git checkout -b ${type}/${name} ${base}`]
					queue(cmd).then(data => {
						if (data[1].code === 0) {
							shell.echo(`${name}分支创建成功，该分支基于${base}创建，您当前已经切换到${type}/${name}\n如果需要提测，请执行${success('gitm merge ' + type + ' ' + name)}\n开发完成后，记得执行: ${success('gitm end ' + type + ' ' + name)}`)
						} else {
							shell.echo(data[1].err, data[1].code)
						}
					})
				}
			})
		} else {
			shell.echo(warning('type只允许输入：' + JSON.stringify(opts)))
			shell.exit(1)
		}
	})
program.parse(process.argv)
