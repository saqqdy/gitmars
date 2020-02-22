#!/usr/bin/env node
const program = require('commander')
const shell = require('shelljs')
const gitm = require('./index')
let config = {},
	configFrom = 0 // 0=没有配置文件 1=.gitmarsrc 2=gitmarsconfig.json
if (shell.test('-f', '.gitmarsrc')) {
	configFrom = 1
	let str = (shell.cat('.gitmarsrc') + '')
			.replace(/(^\n*)|(\n*$)/g, '')
			.replace(/\n{2,}/g, '\n')
			.replace(/[^\S\x0a\x0d]/g, ''),
		arr = []
	if (str) arr = str.split('\n')
	arr.forEach(el => {
		let o = el.split('=')
		config[o[0]] = o[1] || null
	})
} else if (shell.test('-f', 'gitmarsconfig.json')) {
	configFrom = 2
	config = require('../gitmarsconfig.json')
}
/**
 * gitm init
 * @description 初始化gitmars配置
 */
program
	.name('gitm init')
	.usage('')
	.description('设置gitmars的配置项')
	.action(() => {
		let o = [],
			i = 0,
			keys = Object.keys(gitm.defaults)
		shell.echo(gitm.success(gitm.handleConfigOutput(keys[i])))
		process.stdin.resume()
		process.stdin.setEncoding('utf8')
		process.stdin.on('data', data => {
			o.push(keys[i] + ' = ' + (data.replace(/[\n\s]*/g, '') || gitm.defaults[keys[i]]))
			i++
			if (i < keys.length) {
				shell.echo(gitm.success(gitm.handleConfigOutput(keys[i])))
			} else {
				let r = shell.exec(`echo '${o.join('\n')}' >.gitmarsrc`)
				if (r.code === 0) {
					shell.echo(gitm.success('配置成功！'))
					process.exit(0)
				} else {
					process.exit(1)
				}
			}
		})
	})
program.parse(process.argv)
