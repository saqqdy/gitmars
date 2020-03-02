#!/usr/bin/env node
const set = require('./../package.json')
const program = require('commander')
const sh = require('shelljs')
const { warning } = require('./index')
if (!sh.which('git')) {
	sh.echo(warning('gitmars只能在git项目中执行'))
	sh.exit(1)
}
program.version('v' + set.version + ', powered by saqqdy', '-v, --version', '查看gitmars版本')
program
	.name('gitm')
	.usage('[command] options')
	.command('init', '初始化gitmars配置')
	.command('config [options]', '查看/设置gitmars的配置项')
	.command('combine', '分支阶段提测')
	.alias('cb')
	.command('start <type> <name>', '创建bugfix分支、创建/合并release分支')
	.alias('st')
	.command('end <type> <name>', '完成开发某项功能')
	.alias('ed')
	.command('update <type> <name>', '更新bug任务分支、更新feature功能开发分支')
	.alias('up')
	.command('branch', '列出分支列表')
	.alias('bh')
	.command('save', '暂存当前分支文件')
	.alias('sv')
	.command('get', '恢复暂存区最近一次暂存的文件')
	.alias('gt')
	.command('copy <id>', '简化git的cherry-pick操作')
	.alias('cp')
	.command('merge <name>', '合并代码')
	.alias('mg')
	.command('continue', '继续未完成的操作')
	.alias('ct')
	.command('revert', '继续未完成的操作')
	.alias('rt')
	.command('admin <command>', '管理员功能，包含对发版分支bugfix、release的操作')

// 自定义帮助
program.on('--help', function() {
	console.log('使用案例:')
	console.log('  $ gitm init')
	console.log('  $ gitm --help')
	console.log('  $ gitm -h')
})

// 映射不存在的指令
program.on('command:*', function(types, opts) {
	let cmd = ['init', 'config', 'combine', 'cb', 'start', 'st', 'end', 'ed', 'update', 'up', 'branch', 'bh', 'save', 'sv', 'get', 'gt', 'copy', 'cp', 'merge', 'mg', 'continue', 'ct', 'revert', 'rt', 'admin']
	if (!cmd.includes(types[0])) {
		let arr = [].concat(types).concat(opts)
		sh.exec('git ' + arr.join(' '), { silent: false })
	}
})

program.parse(process.argv)
