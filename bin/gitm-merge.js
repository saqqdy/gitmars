#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { warning, success, defaults, config, configFrom, wait, queue, pwd } = require('./index')
/**
 * gitm merge
 */
program
	.name('gitm merge')
	.usage('<name>')
	.arguments('<name>')
	.description('合并分支代码')
	.action(name => {
		if (configFrom === 0) {
			sh.echo(warning('您还没有初始化项目\n请先执行: gitm init'))
			sh.exit(1)
		}
		let cmd = [`cd ${pwd}`, `git merge --no-ff ${name}`, `git push`]
		queue(cmd).then(data => {
			data.forEach((el, index) => {
				if (index === 1) {
					if (el.code === 0) {
						sh.echo(success('分支合并成功！'))
					} else {
						sh.echo(warning(el.out))
					}
				}
				if (el.code !== 0) {
					sh.echo(warning('指令' + cmd[index] + '执行失败，请联系管理员'))
				}
			})
		})
	})
program.parse(process.argv)
