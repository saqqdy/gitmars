#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { options, args } = require('./conf/update')
const { error, queue, getStatus, getCurrent, searchBranch, createArgs } = require('./js/index')
const config = require('./js/getConfig')()
const { defaults } = require('./js/global')
/**
 * gitm update
 */
program.name('gitm update').usage('[type] [name]').description('更新bug任务分支、更新feature功能开发分支、框架调整分支support')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach(o => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('--use-merge', '是否使用merge方式更新，默认rebase', false)
program.action(async (type, name, opt) => {
    const allow = ['bugfix', 'feature', 'support'] // 允许执行的指令
    const deny = [defaults.master, defaults.develop, defaults.release, defaults.bugfix, defaults.support]
    let status = getStatus()
    if (!status) sh.exit(1)
    if (!type) {
        // type和name都没传且当前分支是开发分支
        ;[type, name] = getCurrent().split('/')
        if (!name) {
            deny.includes(type) && sh.echo(error(`骚年，你在${type}分支执行这个指令是什么骚操作？`))
            sh.exit(1)
        }
    } else if (!name) {
        // 传了type没传name
        if (allow.includes(type)) {
            sh.echo('请输入分支名称')
            sh.exit(1)
        }
        let branchs = await searchBranch(type)
        if (branchs.length === 1) {
            ;[type, name] = branchs[0].split('/')
        } else {
            sh.echo(branchs.length > 1 ? `查询到多条名称包含${type}的分支，请输入分支类型` : error('分支不存在，请正确输入'))
            sh.exit(1)
        }
    }
    if (allow.includes(type) && name) {
        // feature从release拉取，bugfix从bug拉取，support从master分支拉取
        let base = type === 'bugfix' ? config.bugfix : type === 'support' ? config.master : config.release,
            cmd = [`git fetch`, `git checkout ${base}`, `git pull`, `git checkout ${type}/${name}`]
        if (opt.useMerge) {
            cmd.push({
                cmd: `git merge --no-ff ${base}`,
                config: { slient: false, again: false, success: `${base}同步到${type}/${name}成功`, fail: `${base}同步到${type}/${name}出错了，请根据提示处理` }
            })
        } else {
            cmd.push({
                cmd: `git rebase ${base}`,
                config: { slient: false, again: false, success: `${base}更新到${type}/${name}成功`, fail: `${base}更新到${type}/${name}出错了，请根据提示处理` }
            })
        }
        queue(cmd)
    } else {
        sh.echo(error('type只允许输入：' + JSON.stringify(allow)))
        sh.exit(1)
    }
})
program.parse(process.argv)
