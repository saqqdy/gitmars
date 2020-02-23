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
	.command('save', '暂存当前分支文件')
	.alias('sv')
	.command('get', '恢复暂存区最近一次暂存的文件')
	.alias('gt')
	.command('copy <id>', '简化git的cherry-pick操作')
	.alias('cp')
	.command('merge <name>', '合并代码')
	.alias('mg')
	.command('admin <command>', '管理员功能，包含对发版分支bugfix、release的操作')

// 自定义帮助
program.on('--help', function() {
	console.log('Examples:')
	console.log('  $ gitm init')
	console.log('  $ gitm --help')
	console.log('  $ gitm -h')
})

program.parse(process.argv)
