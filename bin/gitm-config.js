#!/usr/bin/env node
const path = require('path')
const program = require('commander')
const sh = require('shelljs')
const { error, success } = require('./js/index')
const { defaults, pwd } = require('./js/global')
const configFrom = require('./js/configFrom')
const getConfig = require('./js/getConfig')
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
			sh.echo('请输入：')
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
		const config = getConfig(path.join(pwd, 'gitmarsconfig.json'))
		if (option) {
			sh.echo(config[option])
		} else {
			sh.echo(config)
		}
		sh.exit(0)
	})
program.parse(process.argv)
