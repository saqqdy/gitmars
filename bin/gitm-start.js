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
	.name('gitm start')
	.usage('<type> <name>')
	.arguments('<type> <name>')
	.description('创建bugfix任务分支、创建feature功能开发分支')
	.action((type, name) => {
		if (configFrom === 0) {
			shell.echo(warning('您还没有初始化项目\n请先执行: gitm init'))
			shell.exit(1)
		}
		console.log(type, name)
		if (['bugfix', 'feature'].includes(type)) {
			// feature从dev拉取，其他从master拉取
			let base = type === 'feature' ? config.develop : config.master,
				cmd = [`cd ${pwd}`, `git checkout -b ${type}/${name} ${base}`]
			doShellProgram(cmd).then(data => {
				if (data[1].code === 0) {
					shell.echo(`${name}分支创建成功，该分支基于${base}创建，您当前已经切换到${type}/${name}\n开发完成后，记得执行: ${success('gitm admin end ' + type + ' ' + name)}`)
				} else {
					shell.echo(data[1].err, data[1].code)
				}
			})
		}
	})
program.parse(process.argv)
// console.log(process.argv)