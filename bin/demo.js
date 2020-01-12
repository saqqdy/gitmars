#!/usr/bin/env node
const set = require('./../package.json')
const program = require('commander')
const shell = require('shelljs')
const log = require('tracer').colorConsole()
const colors = require('colors')
let pwd = shell.pwd() + ''
// let config = {}
// if (shell.test('-f', '.gitmanrc')) {
//   let arr = (shell.cat('.gitmanrc') + '')
//     .replace(/(^\n*)|(\n*$)/g, '')
//     .replace(/[^\S\x0a\x0d]/g, '')
//     .split('\n')
//   arr.forEach((el) => {
//     let o = el.split('=')
//     config[o[0]] = o[1] || true
//   })
// } else if (shell.test('-f', 'gitmanconfig.json')) {
//   config = require('../gitmanconfig.json')
// }
// console.log('config set: ', config.aa, typeof config.aa, config)
// config.user = 'saqqdy_wu'
if (!shell.which('git')) {
	shell.echo('Sorry, this script requires git')
	shell.exit(1)
}
/**
 * release:
 * bug:
 * dev:
 */
class HandleShellResult {
	constructor(props) {
		// super(props)
		this.state = {
			user: 'saqqdy',
			email: this.toggleTheme
		}
	}
	toggleTheme = a => {
		console.log(this.state, a)
	}
	make(a) {
		console.log(a + '222')
	}
}
// let aa = new HandleShellResult()
// let bb = new HandleShellResult()
// aa.toggleTheme('222')
// bb.state.email('333')
// console.log(aa)
// aa.make('saqqdy')
program.version('v' + set.version, '-v, --version', 'output the current version')
program
	.command('init')
	.description('start gitman setting')
	.action(() => {
		// if (!shell.test('-f', '.gitmanrc')) {
		shell.exec(`echo 'ss = 22\naa = 22\nbb = 22' >.gitmanrc`)
		// }
		let code = shell.exec('touch .gitmanrc').code
		console.log(code)
	})
program
	.command('set [env]')
	.description('run setup commands for all envs')
	.option('-m, --mode [mode]', 'Which setup mode to use', 'normal')
	.option('-t, --type [type]', 'Which setup mode to use', 'type')
	.action((env = 'all', options) => {
		if (!shell.test('-f', '.gitmanrc')) {
			console.log('您还没有初始化项目\n请先执行: gitm init')
			shell.exit(1)
		}
		console.log(env, options.type, options.mode, new Date().getTime())
		console.log('set: setup for %s env(s) with %s mode', env, options.mode)

		if (shell.exec('git add 1.js').code !== 0) {
			shell.echo(shell.exec('git add 1.js').code)
			shell.echo('Error: Git commit failed')
			shell.exit(1)
		} else {
			shell.echo(shell.exec('git add 1.js').code)
		}
	})
program
	.command('merge')
	.description('run setup commands for all envs')
	.action(() => {
		let result = shell.exec('git merge --no-ff release')
		console.log(result + '', result.code)
		if (result.code === 0) {
			console.log('合并成功！')
		} else if (result.code === 1) {
			console.log('请处理冲突后提交')
		} else {
			// 错误操作 128
		}
	})
// program
//   .command('start <type> <name>')
//   .description('run setup commands for all envs')
//   .action((type, name) => {
//     let result = shell.exec(`git checkout -b ${type}/${name} bug`)
//     console.log(result + '', result.code)
//     if (result.code === 0) {
//       console.log('创建成功！')
//     } else if (result.code === 1) {
//       console.log('创建失败')
//     } else {
//       // 错误操作 128
//     }
//   })
// program
//   .command('end <type> <name>')
//   .description('run setup commands for all envs')
//   .action((type, name) => {
//     let result = shell.exec(`git checkout -b ${type}/${name} bug`)
//     console.log(result + '', result.code)
//     if (result.code === 0) {
//       console.log('创建成功！')
//     } else if (result.code === 1) {
//       console.log('创建失败')
//     } else {
//       // 错误操作 128
//     }
//   })
program
	.command('log [type]')
	.description('run setup commands for all envs')
	.option('-w, --grep [grep]', '模糊搜索关键词', '')
	.option('-a, --author [author]', '提交者', config.user)
	.action((type, opts) => {
		let result = shell.exec(`git log --grep=${opts.grep} --author=${opts.author}`),
			commits = (result + '').match(/(commit\s[a-z0-9]*\n+)/g)
		console.log(commits, result.code)
		commits = commits.map(el => el.replace(/(commit\s)|\n/g, ''))
		// let result1 = shell.exec(`git cherry-pick ${commits.join(' ')}`)
		// if (result1.code === 0) {
		//   //
		// } else if (result.code === 1) {
		//   //
		// } else {
		//   // 错误操作 128
		// }
	})
program
	.command('test')
	.option('--no-sauce', 'Remove sauce')
	.option(
		'--sa [sa]',
		'Remove sauce',
		(val, pre) => {
			console.log('---', val, pre)
			return val + '444'
		},
		12
	)
	.option('--cheese [flavour]', 'cheese flavour', 'mozzarella')
	.option('--no-cheese', 'plain with no cheese')
	.action(opts => {
		console.log(opts.sauce, opts.sa, opts.cheese)
	})
// program
//     .name('gitm')
//     .usage('[command] options')
//     // .helpOption('-e, --HELP', 'read more information')
//     .command('init', '初始化gitman配置')
//     .command('test [service]', 'install one or more packages')
//     .command('config [options]', '查看/设置gitman的配置项')
// //   .option('new', 'Add new branch')
// //   .option('-r, --release', 'Add release')
// //   .option('-b, --branch [branch]', 'Add the specified type of branch [release]', 'release')

program.on('--help', function() {
	console.log('')
	console.log('Examples:')
	console.log('  $ custom-help --help')
	console.log('  $ custom-help -h')
})
// 当有选项verbose时会执行函数
program.on('option:verbose', function() {
	console.log(456)
	process.env.VERBOSE = this.verbose
})

// 未知命令会报错
// program.on('command:*', function () {
//   console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
//   process.exit(1);
// });

program.parse(process.argv)
console.log(program.args)

if (process.argv.slice(2).length === 0) {
	program.outputHelp(warning)
}

function warning(txt) {
	return colors.red(txt)
}
function success(txt) {
	return colors.green(txt)
}

// let pwd = shell.pwd() + ''
// console.log(pwd)
// console.log('你输入了以下指令:')
// if (program.release) console.log('  - peppers')
// console.log('  - %s', program.branch)
