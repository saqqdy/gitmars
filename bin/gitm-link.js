#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
/**
 * gitm link
 */
program
	.name('gitm link')
	.usage('<name> <path>')
	.arguments('<name> <path>')
	.description('链接本地包')
	.action((name, path, opt) => {
		path = path.replace(/\\/g, '/')
		let isLink = sh.test('-L', `./node_modules/${name}`)
		if (isLink) {
			sh.rm('-rf', `./node_modules/${name}`)
		} else {
			sh.mv(`./node_modules/${name}`, `./node_modules/${name}_bak`)
		}
		sh.ln('-s', path, `./node_modules/${name}`)
		sh.echo('处理完成')
	})
program.parse(process.argv)
