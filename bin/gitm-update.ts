#!/usr/bin/env ts-node
const { program } = require('commander')
const sh = require('shelljs')
const { options, args } = require('./conf/update')
const {
    error,
    queue,
    getStatus,
    getCurrent,
    filterBranch,
    isGitProject
} = require('./js/index')
const { isNeedUpgrade, upgradeGitmars } = require('./js/versionControl')
const { createArgs } = require('./js/tools')
if (!isGitProject()) {
    sh.echo(error('当前目录不是git项目目录'))
    sh.exit(1)
}
const getConfig = require('./js/getConfig')
const { defaults } = require('./js/global')
const config = getConfig()

import { GitmarsOptionOptionsType, CommandType } from '../typings'

interface GitmBuildOption {
    useMerge?: boolean
    useRebase?: boolean
    all?: boolean
}

/**
 * gitm update
 */
program
    .name('gitm update')
    .usage('[type] [name] [--use-merge] [--use-rebase] [-a --all]')
    .description(
        '更新bug任务分支、更新feature功能开发分支、框架调整分支support'
    )
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('--use-merge', '是否使用merge方式更新，默认merge方式', true)
// .option('--use-rebase', '是否使用rebase方式更新，默认merge方式', false)
// .option('-a --all', '更新本地所有bugfix、feature、support分支', false)
program.action(
    (type: string | string[], name: string, opt: GitmBuildOption) => {
        // 检测是否需要升级版本
        isNeedUpgrade() && upgradeGitmars()
        const allow = ['bugfix', 'feature', 'support'] // 允许执行的指令
        const deny = [
            defaults.master,
            defaults.develop,
            defaults.release,
            defaults.bugfix,
            defaults.support
        ]
        const status = getStatus()
        let cmds: Array<CommandType | string> = [],
            branchList = [],
            _nameArr: string[] = [] // 分支名称数组
        if (!status) sh.exit(1)
        if (opt.all) {
            // 更新全部分支
            if (!type) type = allow
            branchList = filterBranch('', type)
        } else if (!type || !name) {
            // type或name没传
            const current = getCurrent()
            ;[type, ..._nameArr] = current.split('/')
            name = _nameArr.join('/')
            if (!name) {
                deny.includes(type) &&
                    sh.echo(
                        error(`骚年，你在${type}分支执行这个指令是什么骚操作？`)
                    )
                sh.exit(1)
            }
            if (!allow.includes(type as string)) {
                // type不合法
                sh.echo(error('type只允许输入：' + JSON.stringify(allow)))
                sh.exit(1)
            }
            branchList = [].concat(current)
        } else if (!allow.includes(type as string)) {
            // 传了type和name，但是不合法
            sh.echo(error('type只允许输入：' + JSON.stringify(allow)))
            sh.exit(1)
        } else {
            // 传了正常的type和name
            branchList = [type + '/' + name]
        }
        branchList.forEach((branch: string) => {
            // feature从release拉取，bugfix从bug拉取，support从master分支拉取
            ;[type, ..._nameArr] = branch.split('/')
            name = _nameArr.join('/')
            const base: string =
                type === 'bugfix'
                    ? config.bugfix
                    : type === 'support'
                    ? config.master
                    : config.release
            const cmd: Array<CommandType | string> = [
                'git fetch',
                `git checkout ${base}`,
                'git pull',
                `git checkout ${type}/${name}`
            ]
            if (opt.useRebase) {
                cmd.push({
                    cmd: `git rebase ${base}`,
                    config: {
                        again: false,
                        success: `${base}更新到${type}/${name}成功`,
                        fail: `${base}更新到${type}/${name}出错了，请根据提示处理`
                    }
                })
            } else {
                cmd.push({
                    cmd: `git merge --no-ff ${base}`,
                    config: {
                        again: false,
                        success: `${base}同步到${type}/${name}成功`,
                        fail: `${base}同步到${type}/${name}出错了，请根据提示处理`
                    }
                })
            }
            cmds = cmds.concat(cmd)
        })
        queue(cmds)
    }
)
program.parse(process.argv)
export {}
