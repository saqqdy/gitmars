#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const gitRevParse = require('./js/gitRevParse')
const { error, success, writeFile } = require('./js/index')
const { defaults } = require('./js/global')
const config = require('./js/getConfig')()
/**
 * gitm config set
 */
program
	.name('gitm config')
	.usage('<option> [value]')
	.command('set <option> [value]')
	.description('设置gitmars的配置项')
	.action(async (option, value) => {
		let { filepath } = config
		if (!filepath) {
			const { absUrl } = gitRevParse()
			filepath = absUrl + '/.gitmarsrc'
		}
		if (value) {
			if (Object.keys(defaults).includes(option)) {
				config[option] = value
				await writeFile(filepath, JSON.stringify(config, null, 4))
				sh.echo(success('保存成功'))
				sh.exit(0)
			} else {
				sh.echo(error('不支持' + option + '这个配置项'))
				sh.exit(1)
			}
		} else {
			sh.echo('请输入要配置的项')
			sh.exit(1)
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
		sh.exit(0)
	})
program.parse(process.argv)
