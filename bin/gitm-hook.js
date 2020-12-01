#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const execa = require('execa')
const { queue, success } = require('./js/index')
const config = require('./js/config')
const global = require('./js/global')
const { gitDir } = require('./js/global')
const ora = require('ora')
/**
 * gitm hook
 */
program
	.name('gitm hook')
	.usage('[version]')
	.description('升级gitmars')
	.arguments('[version]')
	// .option('-m, --mirror', '是否使用淘宝镜像', false)
	.action(async (version, opt) => {
		console.log('gitm hook working!', config, global, gitDir)
	})
program.parse(process.argv)
