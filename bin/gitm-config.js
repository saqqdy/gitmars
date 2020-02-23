#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const gitm = require('./index')
let config = {},
	configFrom = 0 // 0=没有配置文件 1=.gitmarsrc 2=gitmarsconfig.json
if (sh.test('-f', '.gitmarsrc')) {
	configFrom = 1
	let str = (sh.cat('.gitmarsrc') + '')
			.replace(/(^\n*)|(\n*$)/g, '')
			.replace(/\n{2,}/g, '\n')
			.replace(/[^\S\x0a\x0d]/g, ''),
		arr = []
	if (str) arr = str.split('\n')
	arr.forEach((el) => {
		let o = el.split('=')
		config[o[0]] = o[1] || null
	})
} else if (sh.test('-f', 'gitmarsconfig.json')) {
	configFrom = 2
	config = require('../gitmarsconfig.json')
}
/**
 * gitm config set
 */
program
	.name('gitm config set')
	.usage('<option> [value]')
	.command('set <option> [value]')
	.description('设置gitmars的配置项')
	.action((option, value) => {
		if (configFrom === 0) {
			sh.echo(gitm.warning('您还没有初始化项目\n请先执行: gitm init'))
			sh.exit(1)
		}
		if (value) {
			let o = { ...config }
			if (Object.keys(gitm.defaults).includes(option)) {
				o[option] = value
				if (configFrom === 2) {
					sh.exec(`echo '${JSON.stringify(o, null, 4)}' >gitmarsconfig.json`)
				} else {
					let arr = []
					for (let k in o) {
						arr.push(k + ' = ' + o[k])
					}
					sh.exec(`echo '${arr.join('\n')}' >.gitmarsrc`)
				}
			} else {
				sh.echo(gitm.warning('不支持' + option + '这个配置项'))
				process.exit(1)
			}
		} else {
			console.log('请输入：')
			process.stdin.resume()
			process.stdin.setEncoding('utf8')
			process.stdin.on('data', (data) => {
				process.stdout.write(data);
				let o = { ...config }
				if (Object.keys(gitm.defaults).includes(option)) {
					o[option] = data.replace(/[\n\s]*/g, '') || gitm.defaults[option]
					if (configFrom === 2) {
						sh.exec(`echo '${JSON.stringify(o, null, 4)}' >gitmarsconfig.json`)
					} else {
						let arr = []
						for (let k in o) {
							arr.push(k + ' = ' + o[k])
						}
						sh.exec(`echo '${arr.join('\n')}' >.gitmarsrc`)
					}
					process.exit(0)
				} else {
					sh.echo(gitm.warning('不支持' + option + '这个配置项'))
					process.exit(1)
				}
			})
		}
	})
program.parse(process.argv)

if (process.argv.slice(2).length === 0) {
	sh.echo(JSON.stringify(config))
}
