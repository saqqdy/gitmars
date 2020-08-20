#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { options, args } = require('./conf/unlink')
const { createArgs } = require('./js/index')
/**
 * gitm unlink
 */
program.name('gitm unlink').usage('<name>').description('解除本地包链接')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach(o => {
	program.option(o.flags, o.description, o.defaultValue)
})
program.action((name, opt) => {
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
