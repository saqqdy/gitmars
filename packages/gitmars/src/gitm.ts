#!/usr/bin/env ts-node
const { program } = require('commander')
const sh = require('shelljs')
const { green } = require('chalk')
const { spawnSync } = require('@gitmars/core/lib/spawn')
const echo = require('@gitmars/core/lib/utils/echo')
const { version } = require('../package.json')
const i18n = require('./locales')

if (!sh.which('git')) {
    echo(
        i18n.__(
            'gitm:Gitmars can only be executed in a git environment, so please install git first'
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
    i18n.__('gitm:View gitmars version number')
)

program
    .name('gitm')
    .usage('[command] options')
    .command('init', i18n.__('gitm:Initialize gitmars configuration'))
    .command(
        'config [options]',
        i18n.__('gitm:View/Set configuration items for gitmars')
    )
    .command('combine', i18n.__('gitm:Branch phase mention test'))
    .alias('cb')
    .command(
        'start <type> <name>',
        i18n.__('gitm:Create bugfix branches, create/merge release branches')
    )
    .alias('st')
    .command('end <type> <name>', i18n.__('gitm:Finish developing a feature'))
    .alias('ed')
    .command(
        'update <type> <name>',
        i18n.__('gitm:Update bugfix branch, update feature development branch')
    )
    .alias('up')
    .command('branch', i18n.__('gitm:List branches'))
    .alias('bh')
    .command('save', i18n.__('gitm:Staging current branch files'))
    .alias('sv')
    .command(
        'get',
        i18n.__(
            'gitm:Restore the most recently staged file in the staging area'
        )
    )
    .alias('gt')
    .command('cleanbranch', i18n.__('gitm:Clean up merged feature branches'))
    .alias('clb')
    .command('copy <id>', i18n.__("gitm:Simplify git's cherry-pick operation"))
    .alias('cp')
    .command('merge <name>', i18n.__('gitm:Merge code'))
    .alias('mg')
    .command('continue', i18n.__('gitm:Continue unfinished operations'))
    .alias('ct')
    .command('revert', i18n.__('gitm:Undo commit'))
    .alias('rt')
    .command('upgrade', i18n.__('gitm:Upgrade gitmars'))
    .alias('ug')
    .command('build', i18n.__('gitm:buildJenkins'))
    .alias('bd')
    .command('suggest', i18n.__('gitm:Action Tips'))
    .alias('sg')
    .command('approve', i18n.__('gitm:Handling remote merge requests'))
    .alias('ap')
    .command('review', i18n.__('gitm:review remote code'))
    .alias('rv')
    .command('status', i18n.__('gitm:view branch status'))
    .command('ui', i18n.__('gitm:Launch web version of gitmars'))
    .command('unlink', i18n.__('gitm:Unlink softlinks'))
    .command('link', i18n.__('gitm:Create soft links'))
    .command('clean', i18n.__('gitm:Clear cache'))
    .command('postmsg', i18n.__('gitm:Push Message'))
    .command('permission', i18n.__('gitm:Commit Permissions'))
    .command('hook', i18n.__('gitm:git hook directive'))
    .command('undo', i18n.__('gitm:Withdraw commits on master branches'))
    .alias('ud')
    .command('redo', i18n.__('gitm:Resume withdrawn code back online'))
    .alias('rd')
    .command('run', i18n.__('gitm:git hook run command'))
    .command('log', i18n.__('gitm:Query log'))
    .command(
        'go',
        i18n.__('gitm:Intelligent guessing of the action you want to perform')
    )
    .command('alias', i18n.__('gitm:Install and remove shortcuts'))
    .command('install', i18n.__('gitm:Install plugins'))
    .alias('i')
    .command(
        'admin <command>',
        i18n.__(
            'gitm:Administrator functions, including actions for bugfixing and releasing release branches'
        )
    )

// 自定义帮助
program.on('--help', function () {
    echo(i18n.__('gitm:Use Case'))
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
                i18n.__mf(
                    'gitm:Gitmars does not provide the command "gitm {command}", it has been passed through to git for execution, here are the results',
                    { command: types[0] }
                )
            )
        )
        spawnSync('git', arr, { stdio: 'inherit' })
    }
})

program.parse(process.argv)
export {}
