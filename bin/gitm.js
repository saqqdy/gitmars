#!/usr/bin/env node
const set = require('./../package.json')
const program = require('commander')
const shell = require('shelljs')
const { warning } = require('./index')
if (!shell.which('git')) {
	shell.echo(warning('gitmars只能在git项目中执行'))
	shell.exit(1)
}
program.version('v' + set.version + ', powered by saqqdy', '-v, --version', '查看gitmars版本')
program
	.name('gitm')
	.usage('[command] options')
	// .helpOption('-e, --HELP', 'read more information')
	.command('init', '初始化gitmars配置')
	.command('config [options]', '查看/设置gitmars的配置项')
	.command('comb', '分支阶段提测')
	.command('start <type> <name>', '创建bugfix分支、创建/合并release分支')
	.command('end <type> <name>', '完成开发某项功能')
	.command('save', '暂存当前分支文件')
	.command('get', '恢复暂存区最近一次暂存的文件')
	.command('copy <id>', '简化git的cherry-pick操作')
	.command('merge <name>', '合并代码')
	.command('admin <command>', '管理员功能，包含对发版分支bugfix、release的操作')
	.command('test [service]', '测试')

// 自定义帮助
program.on('--help', function() {
	console.log('Examples:')
	console.log('  $ gitm --help')
	console.log('  $ gitm -h')
})

// 未知命令会报错
program.on('command:*', function() {
	console.log(warning('您输入的指令 %s 不存在，请输入 gitm --help 查看帮助.'), program.args.join(' '))
	process.exit(1)
})

program.parse(process.argv)
