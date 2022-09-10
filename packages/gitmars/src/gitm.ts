#!/usr/bin/env ts-node
import { createRequire } from 'node:module'
import { program } from 'commander'
import sh from 'shelljs'
import chalk from 'chalk'
import { spawnSync } from '@gitmars/core/lib/spawn'
import echo from '@gitmars/core/lib/utils/echo'
// import { version } from '../package.json' assert { type: 'json' }
import i18n from '#lib/locales/index'

const require = createRequire(import.meta.url)
const { green } = chalk
const { version } = require('../package.json')

if (!sh.which('git')) {
    echo(
        i18n.__(
            'Gitmars can only be executed in a git environment, so please install git first'
        )
    )
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
    i18n.__('View gitmars version number')
)

program
    .name('gitm')
    .usage('[command] options')
    .command('init', i18n.__('Initialize gitmars configuration'))
    .command(
        'config [options]',
        i18n.__('View/Set configuration items for gitmars')
    )
    .command('combine', i18n.__('Branch phase mention test'))
    .alias('cb')
    .command(
        'start <type> <name>',
        i18n.__('Create bugfix branches, create/merge release branches')
    )
    .alias('st')
    .command('end <type> <name>', i18n.__('Finish developing a feature'))
    .alias('ed')
    .command(
        'update <type> <name>',
        i18n.__('Update bugfix branch, update feature development branch')
    )
    .alias('up')
    .command('branch', i18n.__('List branches'))
    .alias('bh')
    .command('save', i18n.__('Staging current branch files'))
    .alias('sv')
    .command(
        'get',
        i18n.__('Restore the most recently staged file in the staging area')
    )
    .alias('gt')
    .command('cleanbranch', i18n.__('Clean up merged feature branches'))
    .alias('clb')
    .command('copy <id>', i18n.__("Simplify git's cherry-pick operation"))
    .alias('cp')
    .command('merge <name>', i18n.__('Merge code'))
    .alias('mg')
    .command('continue', i18n.__('Continue unfinished operations'))
    .alias('ct')
    .command('revert', i18n.__('Undo commit'))
    .alias('rt')
    .command('upgrade', i18n.__('Upgrade gitmars'))
    .alias('ug')
    .command('build', i18n.__('buildJenkins'))
    .alias('bd')
    .command('suggest', i18n.__('Action Tips'))
    .alias('sg')
    .command('approve', i18n.__('Handling remote merge requests'))
    .alias('ap')
    .command('review', i18n.__('review remote code'))
    .alias('rv')
    .command('status', i18n.__('view branch status'))
    .command('ui', i18n.__('Launch web version of gitmars'))
    .command('unlink', i18n.__('Unlink softlinks'))
    .command('link', i18n.__('Create soft links'))
    .command('clean', i18n.__('Clear cache'))
    .command('postmsg', i18n.__('Push Message'))
    .command('permission', i18n.__('Commit Permissions'))
    .command('hook', i18n.__('git hook directive'))
    .command('undo', i18n.__('Withdraw commits on master branches'))
    .alias('ud')
    .command('redo', i18n.__('Resume withdrawn code back online'))
    .alias('rd')
    .command('run', i18n.__('git hook run command'))
    .command('log', i18n.__('Query log'))
    .command(
        'go',
        i18n.__('Intelligent guessing of the action you want to perform')
    )
    .command('alias', i18n.__('Install and remove shortcuts'))
    .command('install', i18n.__('Install plugins'))
    .alias('i')
    .command(
        'admin <command>',
        i18n.__(
            'Administrator functions, including actions for bugfixing and releasing release branches'
        )
    )

// 自定义帮助
program.on('--help', function () {
    echo(i18n.__('Use Case'))
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
        'merge',
        'mg',
        'continue',
        'ct',
        'revert',
        'rt',
        'upgrade',
        'ug',
        'build',
        'bd',
        'suggest',
        'sg',
        'approve',
        'ap',
        'review',
        'rv',
        'status',
        'ui',
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
            type.indexOf('-') === 0 || /^\w+$/.test(type)
                ? type
                : '"' + type + '"'
        )
        const arr = types.concat(opts)
        echo(
            green(
                i18n.__(
                    'Gitmars does not provide the command "gitm {{command}}", it has been passed through to git for execution, here are the results',
                    { command: types[0] }
                )
            )
        )
        spawnSync('git', arr, { stdio: 'inherit' })
    }
})

program.parse(process.argv)
export {}
