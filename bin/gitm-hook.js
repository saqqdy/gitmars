#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const execa = require('execa')
const { queue, success, getCurrent, getStatusInfo, getStashList } = require('./js/index')
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
		const current = getCurrent()
		console.log('gitm hook working!', config, global, gitDir)
		let out = sh.exec('git log -1 --pretty=oneline', { silent: true }).stdout.split(' ').splice(0, 1)[0],
			author = sh.exec(`git log --pretty=format:%an ${out} -1`, { silent: true }).stdout
		// let out = commandSync('git', ['log', '--pretty=oneline', url]).stdout.split(' ').splice(0, 1)[0],
		// committer = commandSync('git', ['log', '--pretty=format:"%cn"', out, '-1']).stdout.replace(/\"/g, ''),
		// author = commandSync('git', ['log', '--pretty=format:"%an"', out, '-1']).stdout.replace(/\"/g, '')
		console.log('--' + out + '--')
		console.log('--' + author + '--')
		console.log(getStatusInfo(), 99)
		// let allow = [config.master],
		// 	msg = sh.exec('git show', { silent: true }).stdout,
		// 	index
		// if (opt.dev) allow.push(config.develop)
		// if (opt.release) allow.push(config.release)
		// index = allow.indexOf(current)
		// if (index > -1 && !opt.noVerify && msg && msg.indexOf('Merge:') === -1 && msg.indexOf('Merge branch') === -1) {
		// 	sh.echo(error(`${allow[index]}分支不允许直接提交`))
		// 	sh.exit(1)
		// } else {
		// 	sh.exit(0)
		// }
		sh.exit(1)
	})
program.parse(process.argv)
