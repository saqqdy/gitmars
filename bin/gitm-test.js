#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { queue, success } = require('./js/index')
const config = require('./js/config')
const global = require('./js/global')
const { gitDir } = require('./js/global')
const ora = require('ora')
/**
 * gitm test
 */
program
	.name('gitm test')
	.usage('[version]')
	.description('升级gitmars')
	.arguments('[version]')
	// .option('-m, --mirror', '是否使用淘宝镜像', false)
	.action(async (version, opt) => {
		console.log(config, global, gitDir)
	})
program.parse(process.argv)
