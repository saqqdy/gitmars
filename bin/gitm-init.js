#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { error, success, queue, pwd, defaults, handleConfigOutput } = require('./index')
let config = {},
	configFrom = 0 // 0=没有配置文件 1=.gitmarsrc 2=gitmarsconfig.json
if (sh.test('-f', pwd + '/.gitmarsrc')) {
	configFrom = 1
	let str = sh
			.cat(pwd + '/.gitmarsrc')
			.stdout.replace(/(^\n*)|(\n*$)/g, '')
			.replace(/\n{2,}/g, '\n')
			.replace(/\r/g, '')
			.replace(/[^\S\x0a\x0d]/g, ''),
		arr = []
	if (str) arr = str.split('\n')
	arr.forEach(el => {
		let o = el.split('=')
		config[o[0]] = o[1] || null
	})
} else if (sh.test('-f', pwd + '/gitmarsconfig.json')) {
	configFrom = 2
	config = require(pwd + '/gitmarsconfig.json')
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
			keys = Object.keys(defaults)
		sh.echo(success(handleConfigOutput(keys[i])))
		process.stdin.resume()
		process.stdin.setEncoding('utf8')
		process.stdin.on('data', data => {
			o.push(keys[i] + ' = ' + (data.replace(/[\n\s]*/g, '') || defaults[keys[i]]))
			i++
			if (i < keys.length) {
				sh.echo(success(handleConfigOutput(keys[i])))
			} else {
				let r = sh.echo(o.join('\n')).to(pwd + '/.gitmarsrc')
				// let r = sh.exec(`echo '${o.join('\n')}' >${pwd}/.gitmarsrc`)
				if (r.code === 0) {
					sh.echo(success('配置成功！'))
					process.exit(0)
				} else {
					process.exit(1)
				}
			}
		})
	})
program.parse(process.argv)
