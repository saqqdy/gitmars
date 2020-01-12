#!/usr/bin/env node
const program = require('commander')
const shell = require('shelljs')
const { warning, success, defaults, config, configFrom, wait, pwd } = require('./index')
let doShellProgram = list => {
	return new Promise((resolve, reject) => {
		let r = []
		if (list.length === 0) reject('指令名称不能为空')
		wait(list, (data, cb) => {
			if (!data) {
				// 只有一条指令，不需返回数组形式
				resolve(r.length === 1 ? r[0] : r)
			} else {
				shell.exec(data, { silent: true }, (code, out, err) => {
					try {
						out = JSON.parse(out)
					} catch (err) {
						out = out.replace(/\n*$/g, '')
					}
					r.push({ code, out, err })
					cb()
				})
			}
		})
	})
}
/**
 * gitm admin start
 * gitm admin end
 */
program
	.name('gitm merge')
	.usage('<name>')
	.arguments('<name>')
	.description('合并代码')
	.action((name) => {
		if (configFrom === 0) {
			shell.echo(warning('您还没有初始化项目\n请先执行: gitm init'))
			shell.exit(1)
		}
		let cmd = [`cd ${pwd}`, `git merge --no-ff ${name}`]
		doShellProgram(cmd).then(data => {
			if (data[1].code === 0) {
				//
			} else {
				shell.echo(data[1].err, data[1].code)
			}
		})
	})
program.parse(process.argv)
// console.log(process.argv)
