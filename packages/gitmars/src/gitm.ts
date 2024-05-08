#!/usr/bin/env ts-node
import { createRequire } from 'node:module'
import { program } from 'commander'
import sh from 'shelljs'
import chalk from 'chalk'
import { echo, spawnSync } from '@gitmars/utils'
// import { version } from '../package.json' assert { type: 'json' }
import lang from './common/local'

const { t } = lang
const require = createRequire(import.meta.url)
const { green } = chalk
const { version } = require('../package.json')

if (!sh.which('git')) {
	echo(t('Gitmars can only be executed in a git environment, so please install git first'))
	process.exit(1)
}
program.version(
	'	\n' +
		' e88~~   ,e,   d8                                         \n' +
		'd888      "  _d88__ 888-~88e-~88e   /~~~8e  888-~  d88~ \n' +
		'8888 __  888  888   888  888  888       88b 888    C888   \n' +
		'8888   | 888  888   888  888  888  e88~-888 888     Y88b  \n' +
		'Y888   | 888  888   888  888  888 C888  888 888      888D \n' +
		' "88__/  888  "88_/ 888  888  888  "88_-888 888    _88P  \n' +
		'                                                          \n' +
		`v${version}, powered by saqqdy\n`,
	'-v, --version',
	t('View gitmars version number')
)

program
	.name('gitm')
	.usage('[command] options')
	.command('init', t('Initialize gitmars configuration'))
	.command('config [options]', t('View/Set configuration items for gitmars'))
	.command('combine', t('Branch phase mention test'))
	.alias('cb')
	.command('start <type> <name>', t('Create bugfix branches, create/merge release branches'))
	.alias('st')
	.command('end <type> <name>', t('Finish developing a feature'))
	.alias('ed')
	.command('update <type> <name>', t('Update bugfix branch, update feature development branch'))
	.alias('up')
	.command('branch', t('List branches'))
	.alias('bh')
	.command('save', t('Staging current branch files'))
	.alias('sv')
	.command('get', t('Restore the most recently staged file in the staging area'))
	.alias('gt')
	.command('cleanbranch', t('Clean up merged feature branches'))
	.alias('clb')
	.command('copy <id>', t("Simplify git's cherry-pick operation"))
	.alias('cp')
	.command('continue', t('Continue unfinished operations'))
	.alias('ct')
	.command('revert', t('Undo commit'))
	.alias('rt')
	.command('upgrade', t('Upgrade gitmars'))
	.alias('ug')
	.command('build', t('Launching a jenkins build task'))
	.alias('bd')
	.command('build-mp', t('Launching a jenkins build task of miniprogram'))
	.alias('bdm')
	.command('miniprogram', t('miniprogram command'))
	.alias('mp')
	.command('suggest', t('Action Tips'))
	.alias('sg')
	.command('approve', t('Handling remote merge requests'))
	.alias('ap')
	.command('review', t('review remote code'))
	.alias('rv')
	.command('status', t('view branch status'))
	.command('unlink', t('Unlink softlinks'))
	.command('link', t('Create soft links'))
	.command('clean', t('Clear cache'))
	.command('postmsg', t('Push Message'))
	.command('permission', t('Commit Permissions'))
	.command('hook', t('git hook directive'))
	.command('undo', t('Withdraw commits on master branches'))
	.alias('ud')
	.command('redo', t('Resume withdrawn code back online'))
	.alias('rd')
	.command('run', t('git hook run command'))
	.command('log', t('Query log'))
	.command('go', t('Intelligent guessing of the action you want to perform'))
	.command('alias', t('Install and remove shortcuts'))
	.command('install', t('Install plugins'))
	.alias('i')
	.command(
		'admin <command>',
		t('Administrator functions, including actions for bugfixing and releasing release branches')
	)

// 自定义帮助
program.on('--help', function () {
	echo(t('Use Case'))
	echo('  $ gitm init')
	echo('  $ gitm --help')
	echo('  $ gitm -h')
})

// 映射不存在的指令
program.on('command:*', function (types: string[], opts: string[]) {
	const cmd = [
		'init',
		'config',
		'combine',
		'cb',
		'start',
		'st',
		'end',
		'ed',
		'update',
		'up',
		'branch',
		'bh',
		'save',
		'sv',
		'get',
		'gt',
		'cleanbranch',
		'clb',
		'copy',
		'cp',
		'continue',
		'ct',
		'revert',
		'rt',
		'upgrade',
		'ug',
		'build',
		'bd',
		'build-mp',
		'bdm',
		'miniprogram',
		'mp',
		'suggest',
		'sg',
		'approve',
		'ap',
		'review',
		'rv',
		'status',
		'unlink',
		'link',
		'clean',
		'postmsg',
		'permission',
		'hook',
		'undo',
		'ud',
		'redo',
		'rd',
		'run',
		'log',
		'go',
		'alias',
		'install',
		'i',
		'admin'
	]
	if (!cmd.includes(types[0])) {
		opts = opts.map(type =>
			type.indexOf('-') === 0 || /^\w+$/.test(type) ? type : '"' + type + '"'
		)
		const arr = types.concat(opts)
		echo(
			green(
				t(
					'Gitmars does not provide the command "gitm {command}", it has been passed through to git for execution, here are the results',
					{ command: types[0] }
				)
			)
		)
		spawnSync('git', arr, { stdio: 'inherit' })
	}
})

program.parse(process.argv)
export {}
