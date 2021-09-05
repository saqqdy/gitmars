#!/usr/bin/env node
const { program } = require('commander')
const { spawnSync } = require('child_process')
const sh = require('shelljs')
const { success } = require('./js/index')
const ora = require('ora')
/**
 * gitm upgrade
 */
program
    .name('gitm upgrade')
    .usage('[version]')
    .description('升级gitmars')
    .arguments('[version]')
    .option('-m, --mirror', '是否使用淘宝镜像', false)
    .action(async (version, opt) => {
        const spinner = ora(success('正在安装请稍后')).start()
        // let match = (version && version.match(/[0-9.]+$/)) || null,
        // 	cmd = `install -g gitmars@${match ? match[0] : 'latest'} ${opt.mirror ? '--registry=https://registry.npm.taobao.org' : ''}`,
        // 	install = await execa('npm', cmd.split(' '), { cwd: process.cwd() }),
        // 	ver = await execa('gitm', ['-v'], { cwd: process.cwd() })
        // spinner.stop()
        // sh.echo(install.stdout + `\n${success('安装完成')}`)
        // sh.echo(ver.stdout)

        let match = (version && version.match(/[0-9.]+$/)) || null,
            cmdAdd = ['npm', ['install', '-g', `gitmars@${match ? match[0] : 'latest'}`]],
            cmdDel = ['npm', ['uninstall', '-g', 'gitmars']]
        if (opt.mirror) cmdAdd[1] = cmdAdd[1].concat(['-registry', 'https://registry.npm.taobao.org'])
        const uninstall = spawnSync(cmdDel[0], cmdDel[1], { stdio: 'inherit', shell: process.platform === 'win32' /*, env: { detached: true }*/ })
        if (uninstall.status === 0) {
            console.warn('安装出错了')
            process.exit(0)
        }
        const install = spawnSync(cmdAdd[0], cmdAdd[1], { stdio: 'inherit', shell: process.platform === 'win32' /*, env: { detached: true }*/ })
        spawnSync('gitm', ['-v'], { stdio: 'inherit', shell: process.platform === 'win32' /*, env: { detached: true }*/ })
        sh.echo(`\n${success('安装完成')}`)
        spinner.stop()
        if (install.status === 0) {
            process.exit(0)
        } else {
            console.warn('安装出错了')
            process.exit(0)
        }

        // let match = (version && version.match(/[0-9.]+$/)) || null,
        // 	cmd = [
        // 		{
        // 			cmd: `npm install -g gitmars@${match ? match[0] : 'latest'} ${opt.mirror ? '--registry=https://registry.npm.taobao.org' : ''}`,
        // 			config: { slient: false, again: true, kill: false, success: '升级成功', fail: '升级失败，请重试' }
        // 		},
        // 		{
        // 			cmd: `gitm -v`,
        // 			config: { slient: true, again: false }
        // 		}
        // 	]
        // queue(cmd).then(data => {
        // 	if (data[0].code === 0) {
        // 		sh.echo(data[1].out)
        // 	}
        // })
    })
program.parse(process.argv)
