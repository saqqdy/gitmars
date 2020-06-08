#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { queue } = require('../src/index')
/**
 * gitm upgrade
 */
program
	.name('gitm upgrade')
	.usage('[version]')
	.description('升级gitmars')
	.arguments('[version]')
	.option('-m, --mirror', '是否使用淘宝镜像', false)
	.action((version, opt) => {
		let match = (version && version.match(/[0-9.]+$/)) || null,
			v = match ? match[0] : 'latest',
			cmd = [
				{
					cmd: `npm install -g gitmars@${v} ${opt.mirror ? '--registry=https://registry.npm.taobao.org' : ''}`,
					config: { slient: false, again: true, kill: false, success: '升级成功', fail: '升级失败，请重试' }
				},
				{
					cmd: `gitm -v`,
					config: { slient: true, again: false }
				}
			]
		queue(cmd).then(data => {
			if (data[0].code === 0) {
				sh.echo(data[1].out)
			}
		})
	})
program.parse(process.argv)
