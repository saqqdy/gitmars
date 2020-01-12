#!/usr/bin/env node
const set = require('./../package.json')
const program = require('commander')
const shell = require('shelljs')
// const { warning } = require('./index')
if (!shell.which('git')) {
	// shell.echo(warning('gitman只能在git项目中执行'))
	shell.exit(1)
}
program.version('v' + set.version + ', powered by saqqdy', '-v, --version', '查看gitman版本')
program
	.name('gitm')
	.usage('[command] options')
	// .helpOption('-e, --HELP', 'read more information')
	.command('init', '初始化gitman配置')
	.command('config [options]', '查看/设置gitman的配置项')
	.command('start <type> <name>', '创建bugfix分支、创建/合并release分支')
	.command('end <type> <name>', '完成开发某项功能')
	.command('copy <id>', '简化git的cherry-pick操作')
	.command('merge <name>', '合并代码')
	.command('admin <command>', '管理员功能，包含对发版分支bugfix、release的操作')
	.command('test [service]', '测试')
// .command('pwd')
// .action(() => {
// 	shell.exec('pwd')
// })

// program.on('--help', function() {
// 	console.log('')
// 	console.log('Examples:')
// 	console.log('  $ custom-help --help')
// 	console.log('  $ custom-help -h')
// })
// 未知命令会报错
// program.on('command:*', function() {
// 	console.log(warning('您输入的指令 %s 不存在，请输入 gitm --help 查看帮助.'), program.args.join(' '))
// 	process.exit(1)
// })

program.parse(process.argv)
