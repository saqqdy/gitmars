#!/usr/bin/env ts-node
const { Command } = require('commander')
const sh = require('shelljs')
const { create, publish, update, clean } = require('./conf/admin')
const { getUserToken } = require('./core/api/index')
const getType = require('js-cool/lib/getType')
const { queue } = require('./core/queue')
const { getIsBranchOrCommitExist } = require('./core/git/index')
const {
    getIsGitProject,
    getCurrentBranch,
    getGitConfig,
    checkGitStatus
} = require('./core/git/index')
const { error, success, createArgs } = require('./core/utils/index')
const { getCurlOfMergeRequest } = require('./core/shell/index')
if (!getIsGitProject()) {
    sh.echo(error('当前目录不是git项目目录'))
    sh.exit(1)
}
const getConfig = require('./core/getConfig')
const { appName } = getGitConfig()
const config = getConfig()

import {
    FetchDataType,
    GitmarsOptionOptionsType,
    CommandType
} from '../typings'

interface GitmBuildOption {
    publish: {
        combine?: boolean
        useRebase?: boolean
        prod?: boolean
        build?: boolean | string
        description?: string
        postmsg?: boolean
    }
    update: {
        useRebase?: boolean
        mode?: 0 | 1 | 2
        description?: string
        postmsg?: boolean
    }
}

type PublishOptsType = 'bugfix' | 'support' | 'release'

/**
 * gitm admin create
 * gitm admin publish
 * gitm admin update
 * gitm admin clean
 */
const program = new Command()

if (create.args.length > 0) {
    const _program = program
        .name('gitm admin')
        .usage('<command> <type>')
        .description('创建bugfix、release、develop和support分支')
        .command('create ' + createArgs(create.args))
    create.options.forEach((o: GitmarsOptionOptionsType) => {
        _program.option(o.flags, o.description, o.defaultValue)
    })
    // .command('create <type>')
    _program.action((type: string): void => {
        const opts = ['bugfix', 'release', 'develop', 'support'] // 允许执行的指令
        const base: string = type === 'release' ? config.master : config.release
        const status = checkGitStatus()
        const hasBase = getIsBranchOrCommitExist(base)
        const exits = getIsBranchOrCommitExist(config[type])
        if (!status) sh.exit(1)
        if (!hasBase) {
            sh.echo(error(base + '分支不存在，请先创建' + base + '分支'))
            sh.exit(1)
        }
        if (exits) {
            sh.echo(error(config[type] + '分支已存在，不需要重复创建'))
            sh.exit(1)
        }
        if (opts.includes(type)) {
            // release从master拉取，其他从release拉取
            const cmd = [
                'git fetch',
                `git checkout ${base}`,
                'git pull',
                `git checkout -b ${config[type]} ${base}`
            ]
            queue(cmd).then((data: any[]) => {
                if (data[3].code === 0) {
                    sh.echo(
                        `${
                            config[type]
                        }分支创建成功，该分支基于${base}创建，您当前已经切换到${
                            config[type]
                        }\n需要发版时，记得执行: ${success(
                            'gitm admin publish ' + config[type]
                        )}`
                    )
                }
            })
        } else {
            sh.echo(error('type只允许输入：' + opts.join(',')))
            sh.exit(1)
        }
    })
}

if (publish.args.length > 0) {
    const _program = program
        .name('gitm admin')
        .usage(
            '<command> <type> [--description [description]] [-c --combine] [--use-rebase] [-p --prod] [-b --build [app]] [--postmsg]'
        )
        .description('发布bugfix、release、support分支')
        .command('publish ' + createArgs(publish.args))
    publish.options.forEach((o: GitmarsOptionOptionsType) => {
        _program.option(o.flags, o.description, o.defaultValue)
    })
    // .command('publish <type>')
    // .option('-c, --combine', '是否把release代码同步到bug', false)
    // .option('--use-rebase', '是否使用rebase方式更新，默认merge', false)
    // .option('-p, --prod', '发布bug分支时，是否合并bug到master', false)
    // .option('-b, --build [build]', '需要构建的应用')
    // .option('--postmsg', '发送消息', false)
    // .option('--description [description]', '本次提交的原因描述', '')
    _program.action(
        async (
            type: PublishOptsType,
            opt: GitmBuildOption['publish']
        ): Promise<void> => {
            const {
                token,
                level,
                nickname = ''
            } = config.api ? await getUserToken() : ({} as FetchDataType)
            const opts = ['bugfix', 'release', 'support'] // 允许执行的指令
            const status = checkGitStatus()
            const curBranch = await getCurrentBranch()
            let isDescriptionCorrect = true // 本次提交的原因描述是否符合规范
            if (!status) sh.exit(1)
            // 有配置descriptionValidator时需要校验描述信息
            if (config.descriptionValidator) {
                // 校验本次提交的原因描述
                const reg =
                    getType(config.descriptionValidator) === 'regexp'
                        ? config.descriptionValidator
                        : new RegExp(config.descriptionValidator)
                isDescriptionCorrect =
                    opt.description && reg.test(opt.description)
            }
            if (opts.includes(type)) {
                /**
                 * bugfix -> master/release
                 * release -> master
                 * develop -> null
                 * support -> bugfix/release
                 */
                let cmd: {
                    [prop in PublishOptsType]: Array<CommandType | string>
                }
                if (!level || level < 3) {
                    cmd = {
                        bugfix: [
                            'git fetch',
                            `git checkout ${config.bugfix}`,
                            'git pull',
                            `git checkout ${config.release}`,
                            'git pull',
                            {
                                cmd: `git merge --no-ff ${config.bugfix}`,
                                config: {
                                    again: false,
                                    postmsg: opt.postmsg,
                                    success: `${config.bugfix}合并到${config.release}成功`,
                                    fail: `${config.bugfix}合并到${config.release}出错了，请根据提示处理`
                                }
                            },
                            {
                                cmd: 'git push',
                                config: {
                                    again: true,
                                    success: '推送成功',
                                    fail: '推送失败，请根据提示处理'
                                }
                            }
                        ],
                        support: [
                            'git fetch',
                            `git checkout ${config.support}`,
                            'git pull',
                            `git checkout ${config.release}`,
                            'git pull',
                            {
                                cmd: `git merge --no-ff ${config.support}`,
                                config: {
                                    again: false,
                                    success: `${config.support}合并到${config.release}成功`,
                                    fail: `${config.support}合并到${config.release}出错了，请根据提示处理`
                                }
                            },
                            {
                                cmd: 'git push',
                                config: {
                                    again: true,
                                    success: '推送成功',
                                    fail: '推送失败，请根据提示处理'
                                }
                            },
                            `git checkout ${config.bugfix}`,
                            'git pull',
                            {
                                cmd: `git merge --no-ff ${config.support}`,
                                config: {
                                    again: false,
                                    success: `${config.support}合并到${config.bugfix}成功`,
                                    fail: `${config.support}合并到${config.bugfix}出错了，请根据提示处理`
                                }
                            },
                            {
                                cmd: 'git push',
                                config: {
                                    again: true,
                                    success: '推送成功',
                                    fail: '推送失败，请根据提示处理'
                                }
                            }
                        ],
                        release: [
                            'git fetch',
                            `git checkout ${config.release}`,
                            'git pull',
                            `git checkout ${config.master}`,
                            'git pull',
                            {
                                cmd: `git merge --no-ff ${config.release}`,
                                config: {
                                    again: false,
                                    success: `${config.release}合并到${config.master}成功`,
                                    fail: `${config.release}合并到${config.master}出错了，请根据提示处理`
                                }
                            },
                            {
                                cmd: 'git push',
                                config: {
                                    again: true,
                                    success: '推送成功',
                                    fail: '推送失败，请根据提示处理'
                                }
                            }
                        ]
                    }
                } else {
                    if (!isDescriptionCorrect) {
                        sh.echo(error('提交的原因描述不符合规范'))
                        sh.exit(1)
                    }
                    cmd = {
                        bugfix: [
                            {
                                cmd: getCurlOfMergeRequest({
                                    source_branch: config.bugfix,
                                    target_branch: config.release,
                                    token,
                                    description: opt.description
                                }),
                                config: {
                                    again: true,
                                    success: '成功创建合并请求',
                                    fail: '创建合并请求出错了，请根据提示处理'
                                }
                            },
                            `gitm postmsg "${nickname}在${appName}项目提交了${config.bugfix}分支合并到${config.release}分支的merge请求"`
                        ],
                        support: [
                            {
                                cmd: getCurlOfMergeRequest({
                                    source_branch: config.support,
                                    target_branch: config.release,
                                    token,
                                    description: opt.description
                                }),
                                config: {
                                    again: true,
                                    success: '成功创建合并请求',
                                    fail: '创建合并请求出错了，请根据提示处理'
                                }
                            },
                            `gitm postmsg "${nickname}在${appName}项目提交了${config.support}分支合并到${config.release}分支的merge请求"`,
                            {
                                cmd: getCurlOfMergeRequest({
                                    source_branch: config.support,
                                    target_branch: config.bugfix,
                                    token,
                                    description: opt.description
                                }),
                                config: {
                                    again: true,
                                    success: '成功创建合并请求',
                                    fail: '创建合并请求出错了，请根据提示处理'
                                }
                            },
                            `gitm postmsg "${nickname}在${appName}项目提交了${config.support}分支合并到${config.bugfix}分支的merge请求"`
                        ],
                        release: [
                            {
                                cmd: getCurlOfMergeRequest({
                                    source_branch: config.release,
                                    target_branch: config.master,
                                    token,
                                    description: opt.description
                                }),
                                config: {
                                    again: true,
                                    success: '成功创建合并请求',
                                    fail: '创建合并请求出错了，请根据提示处理'
                                }
                            },
                            `gitm postmsg "${nickname}在${appName}项目提交了${config.release}分支合并到${config.master}分支的merge请求"`
                        ]
                    }
                }
                // 发布bug分支且同步到master
                if (type === 'bugfix' && opt.prod) {
                    if (!level || level < 3) {
                        cmd[type] = cmd[type].concat([
                            `git checkout ${config.master}`,
                            'git pull',
                            {
                                cmd: `git merge --no-ff ${config.bugfix}`,
                                config: {
                                    again: false,
                                    success: `${config.bugfix}合并到${config.master}成功`,
                                    fail: `${config.bugfix}合并到${config.master}出错了，请根据提示处理`
                                }
                            },
                            {
                                cmd: 'git push',
                                config: {
                                    again: true,
                                    success: '推送成功',
                                    fail: '推送失败，请根据提示处理'
                                }
                            }
                        ])
                    } else {
                        if (!isDescriptionCorrect) {
                            sh.echo(error('提交的原因描述不符合规范'))
                            sh.exit(1)
                        }
                        cmd[type] = cmd[type].concat([
                            {
                                cmd: getCurlOfMergeRequest({
                                    source_branch: config.bugfix,
                                    target_branch: config.master,
                                    token,
                                    description: opt.description
                                }),
                                config: {
                                    again: true,
                                    success: '成功创建合并请求',
                                    fail: '创建合并请求出错了，请根据提示处理'
                                }
                            },
                            `gitm postmsg "${nickname}在${appName}项目提交了${config.bugfix}分支合并到${config.master}分支的merge请求"`
                        ])
                    }
                    if (opt.build && (!level || level < 3)) {
                        cmd[type] = cmd[type].concat([
                            {
                                cmd: `gitm build ${appName} --env bug --app ${
                                    opt.build === true ? 'all' : opt.build
                                }`,
                                config: {
                                    again: false,
                                    success: '调起构建成功',
                                    fail: '调起构建失败'
                                }
                            }
                        ])
                    }
                }
                // 发布release
                if (type === 'release' && opt.build && (!level || level < 3)) {
                    cmd[type] = cmd[type].concat([
                        {
                            cmd: `gitm build ${appName} --env prod --app ${
                                opt.build === true ? 'all' : opt.build
                            }`,
                            config: {
                                again: false,
                                success: '调起构建成功',
                                fail: '调起构建失败'
                            }
                        }
                    ])
                }
                // 发布release分支且同步release代码到bug线
                if (type === 'release' && opt.combine) {
                    // 使用rebase
                    if (opt.useRebase) {
                        cmd[type] = cmd[type].concat([
                            `git checkout ${config.release}`,
                            'git pull',
                            `git checkout ${config.bugfix}`,
                            {
                                cmd: `git pull origin ${config.bugfix} --rebase`,
                                config: { again: true }
                            },
                            {
                                cmd: `git rebase ${config.release}`,
                                config: {
                                    again: false,
                                    postmsg: opt.postmsg,
                                    success: `${config.release}同步到${config.bugfix}成功`,
                                    fail: `${config.release}同步到${config.bugfix}出错了，请根据提示处理`
                                }
                            },
                            {
                                cmd: 'git push',
                                config: {
                                    again: true,
                                    success: '推送成功',
                                    fail: '推送失败，请根据提示处理'
                                }
                            }
                        ])
                    } else {
                        if (!level || level < 3) {
                            cmd[type] = cmd[type].concat([
                                `git checkout ${config.release}`,
                                'git pull',
                                `git checkout ${config.bugfix}`,
                                'git pull',
                                {
                                    cmd: `git merge --no-ff ${config.release}`,
                                    config: {
                                        again: false,
                                        postmsg: opt.postmsg,
                                        success: `${config.release}合并到${config.bugfix}成功`,
                                        fail: `${config.release}合并到${config.bugfix}出错了，请根据提示处理`
                                    }
                                },
                                {
                                    cmd: 'git push',
                                    config: {
                                        again: true,
                                        success: '推送成功',
                                        fail: '推送失败，请根据提示处理'
                                    }
                                }
                            ])
                        } else {
                            if (!isDescriptionCorrect) {
                                sh.echo(error('提交的原因描述不符合规范'))
                                sh.exit(1)
                            }
                            cmd[type] = cmd[type].concat([
                                {
                                    cmd: getCurlOfMergeRequest({
                                        source_branch: config.release,
                                        target_branch: config.bugfix,
                                        token,
                                        description: opt.description
                                    }),
                                    config: {
                                        again: true,
                                        success: '成功创建合并请求',
                                        fail: '创建合并请求出错了，请根据提示处理'
                                    }
                                },
                                `gitm postmsg "${nickname}在${appName}项目提交了${config.release}分支合并到${config.bugfix}分支的merge请求"`
                            ])
                        }
                    }
                }
                let key: keyof typeof cmd
                // 回到当前分支
                for (key in cmd) {
                    cmd[key].push(`git checkout ${curBranch}`)
                }
                queue(cmd[type])
            } else {
                sh.echo(error('type只允许输入：' + opts.join(',')))
                sh.exit(1)
            }
        }
    )
}

if (update.args.length > 0) {
    const _program = program
        .name('gitm admin')
        .usage(
            '<command> <type> [-m --mode [mode]] [--description [description]] [--use-rebase] [--postmsg]'
        )
        .description('更新bugfix、release、support分支代码')
        .command('update ' + createArgs(update.args))
    update.options.forEach((o: GitmarsOptionOptionsType) => {
        _program.option(o.flags, o.description, o.defaultValue)
    })
    // .command('update <type>')
    // .option('--use-rebase', '是否使用rebase方式更新，默认merge', false)
    // .option('-m, --mode [mode]', '出现冲突时，保留传入代码还是保留当前代码；1=采用当前 2=采用传入；默认为 0=手动处理。本参数不可与--use-rebase同时使用', 0)
    // .option('--postmsg', '发送消息', false)
    // .option('--description [description]', '本次提交的原因描述', '')
    _program.action(
        async (type: string, opt: GitmBuildOption['update']): Promise<void> => {
            const {
                token,
                level,
                nickname = ''
            } = config.api ? await getUserToken() : ({} as FetchDataType)
            const opts = ['bugfix', 'release', 'support'] // 允许执行的指令
            const base = type === 'release' ? config.master : config.release
            const status = checkGitStatus()
            let mode = '', // 冲突时，保留哪方代码
                isDescriptionCorrect = true // 本次提交的原因描述是否符合规范
            if (!status) sh.exit(1)
            // 有配置descriptionValidator时需要校验描述信息
            if (config.descriptionValidator) {
                // 校验本次提交的原因描述
                const reg =
                    getType(config.descriptionValidator) === 'regexp'
                        ? config.descriptionValidator
                        : new RegExp(config.descriptionValidator)
                isDescriptionCorrect =
                    opt.description && reg.test(opt.description)
            }
            if (opt.mode === 1) {
                mode = ' --strategy-option ours'
            } else if (opt.mode === 2) {
                mode = ' --strategy-option theirs'
            }
            if (opts.includes(type)) {
                let cmd
                if (!level || level < 3) {
                    cmd = [
                        'git fetch',
                        `git checkout ${base}`,
                        'git pull',
                        `git checkout ${config[type]}`,
                        {
                            cmd: 'git pull',
                            config: { again: true }
                        },
                        {
                            cmd: `git merge --no-ff ${base}${mode}`,
                            config: {
                                again: false,
                                postmsg: opt.postmsg,
                                success: `${base}同步到${config[type]}成功`,
                                fail: `${base}同步到${config[type]}出错了，请根据提示处理`
                            }
                        },
                        {
                            cmd: 'git push',
                            config: {
                                again: true,
                                success: '推送成功',
                                fail: '推送失败，请根据提示处理'
                            }
                        }
                    ]
                } else {
                    if (!isDescriptionCorrect) {
                        sh.echo(error('提交的原因描述不符合规范'))
                        sh.exit(1)
                    }
                    cmd = [
                        {
                            cmd: getCurlOfMergeRequest({
                                source_branch: base,
                                target_branch: config[type],
                                token,
                                description: opt.description
                            }),
                            config: {
                                again: true,
                                success: '成功创建合并请求',
                                fail: '创建合并请求出错了，请根据提示处理'
                            }
                        },
                        `gitm postmsg "${nickname}在${appName}项目提交了${base}分支合并到${config[type]}分支的merge请求"`
                    ]
                }
                if (opt.useRebase) {
                    cmd = [
                        'git fetch',
                        `git checkout ${base}`,
                        'git pull',
                        `git checkout ${config[type]}`,
                        {
                            cmd: `git pull origin ${config[type]} --rebase`,
                            config: { again: true }
                        },
                        {
                            cmd: `git rebase ${base}`,
                            config: {
                                again: false,
                                postmsg: opt.postmsg,
                                success: `${base}同步到${config[type]}成功`,
                                fail: `${base}同步到${config[type]}出错了，请根据提示处理`
                            }
                        },
                        {
                            cmd: 'git push',
                            config: {
                                again: true,
                                success: '推送成功',
                                fail: '推送失败，请根据提示处理'
                            }
                        }
                    ]
                }
                queue(cmd)
            } else {
                sh.echo(error('type只允许输入：' + opts.join(',')))
                sh.exit(1)
            }
        }
    )
}

if (clean.args.length > 0) {
    const _program = program
        .name('gitm admin')
        .usage('<command> <type>')
        .description('构建清理工作')
        .command('clean ' + createArgs(clean.args))
    clean.options.forEach((o: GitmarsOptionOptionsType) => {
        _program.option(o.flags, o.description, o.defaultValue)
    })
    // .command('clean <type>')
    _program.action((type: string): void => {
        const opts = ['bugfix', 'release', 'develop', 'master'] // 允许执行的指令
        const status = checkGitStatus()
        if (!status) sh.exit(1)
        if (opts.includes(type)) {
            let cmd = [
                'git fetch',
                'git checkout . -f',
                'git clean -fd',
                `git checkout ${config.master}`,
                `git branch -D ${config[type]}`,
                'git fetch',
                `git checkout ${config[type]}`,
                'git pull'
            ]
            if (type === 'master')
                cmd = [
                    'git checkout .',
                    'git clean -fd',
                    `git checkout ${config.master}`,
                    'git clean -fd',
                    'git fetch',
                    'git pull'
                ]
            queue(cmd)
        } else {
            sh.echo(error('type只允许输入：' + opts.join(',')))
            sh.exit(1)
        }
    })
}

program.parse(process.argv)
export {}
