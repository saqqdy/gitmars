#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { warning, success, config, configFrom, queue, pwd } = require('./index')
/**
 * gitm merge
 */
program
	.name('gitm merge')
	.usage('<name>')
	.arguments('<name>')
	.description('合并分支代码')
	.action(name => {
		let cmd = [
			`cd ${pwd}`,
			{
				cmd: `git merge --no-ff ${name}`,
				config: { slient: false }
			},
			`git push`
		]
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
