#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
/**
 * gitm unlink
 */
program
	.name('gitm unlink')
	.usage('<name>')
	.arguments('<name>')
	.description('解除本地包链接')
	.action((name, opt) => {
		let isLink = sh.test('-L', `./node_modules/${name}`),
			isExist = sh.test('-e', `./node_modules/${name}_bak`)
		if (isLink) {
			sh.rm('-rf', `./node_modules/${name}`)
		} else {
			sh.echo('没有找到软链，请确认输入正确名称')
		}
		if (isExist) {
			sh.mv(`./node_modules/${name}_bak`, `./node_modules/${name}`)
		}
		sh.echo('处理完成')
	})
program.parse(process.argv)
