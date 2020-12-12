#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const inquirer = require('inquirer')
const { success, handleConfigOutput } = require('./js/index')
const { defaults, pwd } = require('./js/global')
/**
 * gitm init
 * @description 初始化gitmars配置
 */
program
	.name('gitm init')
	.usage('')
	.description('设置gitmars的配置项')
	.action(() => {
		// let prompts = []
		// Object.keys(defaults).forEach(key => {
		// 	prompt.push({
		// 		type: 'expand',
		// 		message: '',
		// 		name: 'overwrite',
		// 		choices: [
		// 			{
		// 				key: 'y',
		// 				name: 'Overwrite',
		// 				value: 'overwrite'
		// 			},
		// 			{
		// 				key: 'a',
		// 				name: 'Overwrite this one and all next',
		// 				value: 'overwrite_all'
		// 			},
		// 			{
		// 				key: 'd',
		// 				name: 'Show diff',
		// 				value: 'diff'
		// 			},
		// 			new inquirer.Separator(),
		// 			{
		// 				key: 'x',
		// 				name: 'Abort',
		// 				value: 'abort'
		// 			}
		// 		]
		// 	})
		// })
		// inquirer.prompt(prompts).then(answers => {
		// 	console.log(JSON.stringify(answers, null, '  '))
		// })
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
