#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { error, success, queue, getCurrent, pwd, defaults } = require('./index')
let config = {},
	configFrom = 0 // 0=没有配置文件 1=.gitmarsrc 2=gitmarsconfig.json
if (sh.test('-f', pwd + '/.gitmarsrc')) {
	configFrom = 1
	let str = sh
			.cat(pwd + '/.gitmarsrc')
			.stdout.replace(/(^\n*)|(\n*$)/g, '')
			.replace(/\r/g, '')
			.replace(/\n{2,}/g, '\n')
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
 * gitm config set
 */
program
	.name('gitm config')
	.usage('<option> [value]')
	.command('set <option> [value]')
	.description('设置gitmars的配置项')
	.action((option, value) => {
		if (value) {
			let o = { ...config }
			if (Object.keys(defaults).includes(option)) {
				o[option] = value
				if (configFrom === 2) {
					sh.touch(pwd + '/gitmarsconfig.json')
					sh.echo(JSON.stringify(o, null, 4)).to(pwd + '/gitmarsconfig.json')
					// sh.sed('-i', /[\s\S\n\r\x0a\x0d]*/, JSON.stringify(o, null, 4), pwd + '/gitmarsconfig.json')
					// sh.exec(`echo '${JSON.stringify(o, null, 4)}' >${pwd}/gitmarsconfig.json`)
				} else {
					let arr = []
					for (let k in o) {
						arr.push(k + ' = ' + o[k])
					}
					sh.touch(pwd + '/.gitmarsrc')
					sh.echo(arr.join('\n')).to(pwd + '/.gitmarsrc')
					// sh.exec(`echo ${arr.join('\n')}>${pwd}/.gitmarsrc`, { encoding: true })
				}
			} else {
				sh.echo(error('不支持' + option + '这个配置项'))
				process.exit(1)
			}
		} else {
			console.log('请输入：')
			process.stdin.resume()
			process.stdin.setEncoding('utf8')
			process.stdin.on('data', data => {
				process.stdout.write(data)
				let o = { ...config }
				if (Object.keys(defaults).includes(option)) {
					o[option] = data.replace(/[\n\s]*/g, '') || defaults[option]
					if (configFrom === 2) {
						sh.touch(pwd + '/gitmarsconfig.json')
						sh.echo(JSON.stringify(o, null, 4)).to(pwd + '/gitmarsconfig.json')
						// sh.exec(`echo '${JSON.stringify(o, null, 4)}' >${pwd}/gitmarsconfig.json`)
					} else {
						let arr = []
						for (let k in o) {
							arr.push(k + ' = ' + o[k])
						}
						sh.touch(pwd + '/.gitmarsrc')
						sh.echo(arr.join('\n')).to(pwd + '/.gitmarsrc')
						// sh.exec(`echo '${arr.join('\n')}' >${pwd}/.gitmarsrc`)
					}
					process.exit(0)
				} else {
					sh.echo(error('不支持' + option + '这个配置项'))
					process.exit(1)
				}
			})
		}
	})
/**
 * gitm config list
 */
program
	.name('gitm config')
	.usage('list [option]')
	.command('list [option]')
	.description('查询单个或全部gitmars的配置项')
	.action(option => {
		if (option) {
			sh.echo(success(config[option]))
		} else {
			sh.echo(success(config))
		}
		sh.exit(1)
	})
program.parse(process.argv)
