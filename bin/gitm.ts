#!/usr/bin/env ts-node
const { program } = require('commander')
const { version } = require('../package.json')
const sh = require('shelljs')
const { spawnSync } = require('./core/spawn')

if (!sh.which('git')) {
    sh.echo('gitmars只能在git环境下执行，请先安装git')
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
    '查看gitmars版本'
)

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
    .command('cleanbranch', '清理合并过的功能分支')
    .alias('clb')
    .command('copy <id>', '简化git的cherry-pick操作')
    .alias('cp')
    .command('merge <name>', '合并代码')
    .alias('mg')
    .command('continue', '继续未完成的操作')
    .alias('ct')
    .command('revert', '撤销提交')
    .alias('rt')
    .command('upgrade', '升级gitmars')
    .alias('ug')
    .command('build', '构建Jenkins')
    .alias('bd')
    .command('ui', '启动网页版gitmars')
    .command('unlink', '解除软链接')
    .command('link', '软链接')
    .command('clean', '清除缓存')
    .command('postmsg', '推送消息')
    .command('permission', '提交权限')
    .command('hook', 'git钩子指令')
    .command('undo', '撤回主干分支上的提交')
    .alias('ud')
    .command('redo', '恢复撤回的代码重新上线')
    .alias('rd')
    .command('run', 'git钩子运行指令')
    .command('log', '查询日志')
    .command('go', '智能猜测你要执行的动作')
    .command(
        'admin <command>',
        '管理员功能，包含对发版分支bugfix、release的操作'
    )

// 自定义帮助
program.on('--help', function () {
    sh.echo('使用案例:')
    sh.echo('  $ gitm init')
    sh.echo('  $ gitm --help')
    sh.echo('  $ gitm -h')
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
        'admin'
    ]
    if (!cmd.includes(types[0])) {
        const arr = types.concat(opts)
        spawnSync('git', arr, { stdio: 'inherit' })
    }
})

program.parse(process.argv)
export {}
