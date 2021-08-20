#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const inquirer = require('inquirer')
const { options, args } = require('./conf/go')
const { combine, end, update, build, start, admin, branch, copy, get, save, revert, link, unlink, postmsg } = require('./js/go')
const { success, getCurrent } = require('./js/index')
const { createArgs } = require('./js/tools')
// const config = require('./js/getConfig')()

/**
 * gitm go
 */
program.name('gitm go').usage('[command]').description('智能猜测你要执行的动作')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach(o => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .arguments('[command]')
// .option('--no-verify', '是否需要跳过校验权限', false)
// .option('-s, --since [since]', '查询在某个时间之后的日志，填写格式：10s/2m/2h/3d/4M/5y', '7d')
// .option('-l, --limit [limit]', '最多查询的日志条数')
// .option('-b, --branches [branches]', '要查询的分支')
program.action(async (command, opt) => {
    // const mainBranchs = [config.master, config.develop, config.release, config.support, config.bugfix]
    const current = getCurrent()
    // const branchPrefix = current.split('/')[0]
    sh.echo(success(`当前分支${current}，系统猜测你可能想做以下操作：`))
    // 选择指令
    inquirer
        .prompt({
            type: 'list',
            name: 'command',
            message: '请选择你想要的操作?',
            default: 'combine',
            choices: [
                //
                new inquirer.Separator(' === 1. Gitmars工作流 === '),
                'combine',
                'end',
                'update',
                'build',
                'start',
                'admin.publish',
                'admin.update',
                'admin.create',
                'admin.clean',
                new inquirer.Separator(' === 2. 高级工具 === '),
                'branch',
                'copy',
                'get',
                'save',
                'revert',
                'link',
                'unlink',
                'postmsg',
                new inquirer.Separator(' === 退出 === '),
                'exit',
                new inquirer.Separator()
            ],
            filter: val => {
                return val
            }
        })
        .then(answers => {
            if (answers.command === 'exit') {
                sh.echo(success('已退出'))
                sh.exit(0)
            }
            sh.echo(success(`你选择了${answers.command}指令`))
            if (answers.command === 'combine') {
                combine()
            } else if (answers.command === 'end') {
                sh.echo('注意end指令会在执行合并代码到dev和预发之后删除分支')
                end()
            } else if (answers.command === 'update') {
                update()
            } else if (answers.command === 'build') {
                build()
            } else if (answers.command === 'start') {
                start()
            } else if (answers.command === 'admin.publish') {
                admin.publish()
            } else if (answers.command === 'admin.update') {
                admin.update()
            } else if (answers.command === 'admin.create') {
                admin.create()
            } else if (answers.command === 'admin.clean') {
                admin.clean()
            } else if (answers.command === 'branch') {
                branch()
            } else if (answers.command === 'copy') {
                copy()
            } else if (answers.command === 'get') {
                get()
            } else if (answers.command === 'save') {
                save()
            } else if (answers.command === 'revert') {
                revert()
            } else if (answers.command === 'link') {
                link()
            } else if (answers.command === 'unlink') {
                unlink()
            } else if (answers.command === 'postmsg') {
                postmsg()
            }
        })
})
program.parse(process.argv)
