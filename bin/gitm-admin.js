#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { create, publish, update, clean } = require('./conf/admin')
const { getUserToken } = require('./js/api')
const { error, success, queue, getStatus, checkBranch, getCurrent } = require('./js/index')
const { createArgs } = require('./js/tools')
const { appName } = require('./js/getGitConfig')()
const config = require('./js/getConfig')()
const { token, level, nickname = '' } = config.api ? getUserToken() : {}
/**
 * gitm admin create
 * gitm admin publish
 * gitm admin update
 * gitm admin clean
 */
if (create.args.length > 0) {
    let _program = program
        .name('gitm admin')
        .usage('<command> <type>')
        .description('创建bugfix、release、develop和support分支')
        .command('create ' + createArgs(create.args))
    create.options.forEach(o => {
        _program.option(o.flags, o.description, o.defaultValue)
    })
    // .command('create <type>')
    _program.action(async type => {
        const opts = ['bugfix', 'release', 'develop', 'support'] // 允许执行的指令
        let base = type === 'release' ? config.master : config.release,
            status = getStatus(),
            hasBase = await checkBranch(base),
            exits = await checkBranch(config[type])
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
            let cmd = [`git fetch`, `git checkout ${base}`, `git pull`, `git checkout -b ${config[type]} ${base}`]
            queue(cmd).then(data => {
                if (data[3].code === 0) {
                    sh.echo(`${config[type]}分支创建成功，该分支基于${base}创建，您当前已经切换到${config[type]}\n需要发版时，记得执行: ${success('gitm admin publish ' + config[type])}`)
                }
            })
        } else {
            sh.echo(error('type只允许输入：' + opts.join(',')))
            sh.exit(1)
        }
    })
}

if (publish.args.length > 0) {
    let _program = program
        .name('gitm admin')
        .usage('<command> <type>')
        .description('发布bugfix、release、support分支')
        .command('publish ' + createArgs(publish.args))
    publish.options.forEach(o => {
        _program.option(o.flags, o.description, o.defaultValue)
    })
    // .command('publish <type>')
    // .option('-c, --combine', '是否把release代码同步到bug', false)
    // .option('--use-rebase', '是否使用rebase方式更新，默认merge', false)
    // .option('-p, --prod', '发布bug分支时，是否合并bug到master', false)
    // .option('-b, --build [build]', '需要构建的应用')
    // .option('--postmsg', '发送消息', false)
    _program.action(async (type, opt) => {
        const opts = ['bugfix', 'release', 'support'] // 允许执行的指令
        let status = getStatus(),
            curBranch = await getCurrent()
        if (!status) sh.exit(1)
        if (opts.includes(type)) {
            /**
             * bugfix -> master/release
             * release -> master
             * develop -> null
             * support -> bugfix/release
             */
            let cmd =
                !level || level < 3
                    ? {
                          bugfix: [
                              `git fetch`,
                              `git checkout ${config.bugfix}`,
                              `git pull`,
                              `git checkout ${config.release}`,
                              `git pull`,
                              {
                                  cmd: `git merge --no-ff ${config.bugfix}`,
                                  config: { slient: false, again: false, postmsg: opt.postmsg, success: `${config.bugfix}合并到${config.release}成功`, fail: `${config.bugfix}合并到${config.release}出错了，请根据提示处理` }
                              },
                              {
                                  cmd: `git push`,
                                  config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
                              }
                          ],
                          support: [
                              `git fetch`,
                              `git checkout ${config.support}`,
                              `git pull`,
                              `git checkout ${config.release}`,
                              `git pull`,
                              {
                                  cmd: `git merge --no-ff ${config.support}`,
                                  config: { slient: false, again: false, success: `${config.support}合并到${config.release}成功`, fail: `${config.support}合并到${config.release}出错了，请根据提示处理` }
                              },
                              {
                                  cmd: `git push`,
                                  config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
                              },
                              `git checkout ${config.bugfix}`,
                              `git pull`,
                              {
                                  cmd: `git merge --no-ff ${config.support}`,
                                  config: { slient: false, again: false, success: `${config.support}合并到${config.bugfix}成功`, fail: `${config.support}合并到${config.bugfix}出错了，请根据提示处理` }
                              },
                              {
                                  cmd: `git push`,
                                  config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
                              }
                          ],
                          release: [
                              `git fetch`,
                              `git checkout ${config.release}`,
                              `git pull`,
                              `git checkout ${config.master}`,
                              `git pull`,
                              {
                                  cmd: `git merge --no-ff ${config.release}`,
                                  config: { slient: false, again: false, success: `${config.release}合并到${config.master}成功`, fail: `${config.release}合并到${config.master}出错了，请根据提示处理` }
                              },
                              {
                                  cmd: `git push`,
                                  config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
                              }
                          ]
                      }
                    : {
                          bugfix: [
                              {
                                  cmd: `curl -i -H "Content-Type: application/json" -X POST -d "{\\"source_branch\\":\\"${config.bugfix}\\",\\"target_branch\\":\\"${config.release}\\",\\"private_token\\":\\"${token}\\",\\"title\\":\\"Merge branch '${config.bugfix}' into '${config.release}'\\"}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`,
                                  config: { slient: false, again: true, success: '成功创建合并请求', fail: '创建合并请求出错了，请根据提示处理' }
                              },
                              `gitm postmsg "${nickname}在${appName}项目提交了${config.bugfix}分支合并到${config.release}分支的merge请求"`
                          ],
                          support: [
                              {
                                  cmd: `curl -i -H "Content-Type: application/json" -X POST -d "{\\"source_branch\\":\\"${config.support}\\",\\"target_branch\\":\\"${config.release}\\",\\"private_token\\":\\"${token}\\",\\"title\\":\\"Merge branch '${config.support}' into '${config.release}'\\"}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`,
                                  config: { slient: false, again: true, success: '成功创建合并请求', fail: '创建合并请求出错了，请根据提示处理' }
                              },
                              `gitm postmsg "${nickname}在${appName}项目提交了${config.support}分支合并到${config.release}分支的merge请求"`,
                              {
                                  cmd: `curl -i -H "Content-Type: application/json" -X POST -d "{\\"source_branch\\":\\"${config.support}\\",\\"target_branch\\":\\"${config.bugfix}\\",\\"private_token\\":\\"${token}\\",\\"title\\":\\"Merge branch '${config.support}' into '${config.bugfix}'\\"}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`,
                                  config: { slient: false, again: true, success: '成功创建合并请求', fail: '创建合并请求出错了，请根据提示处理' }
                              },
                              `gitm postmsg "${nickname}在${appName}项目提交了${config.support}分支合并到${config.bugfix}分支的merge请求"`
                          ],
                          release: [
                              {
                                  cmd: `curl -i -H "Content-Type: application/json" -X POST -d "{\\"source_branch\\":\\"${config.release}\\",\\"target_branch\\":\\"${config.master}\\",\\"private_token\\":\\"${token}\\",\\"title\\":\\"Merge branch '${config.release}' into '${config.master}'\\"}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`,
                                  config: { slient: false, again: true, success: '成功创建合并请求', fail: '创建合并请求出错了，请根据提示处理' }
                              },
                              `gitm postmsg "${nickname}在${appName}项目提交了${config.release}分支合并到${config.master}分支的merge请求"`
                          ]
                      }
            // 发布bug分支且同步到master
            if (type === 'bugfix' && opt.prod) {
                cmd[type] = cmd[type].concat(
                    !level || level < 3
                        ? [
                              `git checkout ${config.master}`,
                              `git pull`,
                              {
                                  cmd: `git merge --no-ff ${config.bugfix}`,
                                  config: { slient: false, again: false, success: `${config.bugfix}合并到${config.master}成功`, fail: `${config.bugfix}合并到${config.master}出错了，请根据提示处理` }
                              },
                              {
                                  cmd: `git push`,
                                  config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
                              }
                          ]
                        : [
                              {
                                  cmd: `curl -i -H "Content-Type: application/json" -X POST -d "{\\"source_branch\\":\\"${config.bugfix}\\",\\"target_branch\\":\\"${config.master}\\",\\"private_token\\":\\"${token}\\",\\"title\\":\\"Merge branch '${config.bugfix}' into '${config.master}'\\"}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`,
                                  config: { slient: false, again: true, success: '成功创建合并请求', fail: '创建合并请求出错了，请根据提示处理' }
                              },
                              `gitm postmsg "${nickname}在${appName}项目提交了${config.bugfix}分支合并到${config.master}分支的merge请求"`
                          ]
                )
                if (opt.build && (!level || level < 3)) {
                    cmd[type] = cmd[type].concat([
                        {
                            cmd: `gitm build ${appName} --env bug --app ${opt.build === true ? 'all' : opt.build}`,
                            config: { slient: true, again: false, success: '调起构建成功', fail: '调起构建失败' }
                        }
                    ])
                }
            }
            // 发布release
            if (type === 'release' && opt.build && (!level || level < 3)) {
                cmd[type] = cmd[type].concat([
                    {
                        cmd: `gitm build ${appName} --env prod --app ${opt.build === true ? 'all' : opt.build}`,
                        config: { slient: true, again: false, success: '调起构建成功', fail: '调起构建失败' }
                    }
                ])
            }
            // 发布release分支且同步release代码到bug线
            if (type === 'release' && opt.combine) {
                // 使用rebase
                if (opt.useRebase) {
                    cmd[type] = cmd[type].concat([
                        `git checkout ${config.release}`,
                        `git pull`,
                        `git checkout ${config.bugfix}`,
                        {
                            cmd: `git pull origin ${config.bugfix} --rebase`,
                            config: { slient: false, again: true }
                        },
                        {
                            cmd: `git rebase ${config.release}`,
                            config: { slient: false, again: false, postmsg: opt.postmsg, success: `${config.release}同步到${config.bugfix}成功`, fail: `${config.release}同步到${config.bugfix}出错了，请根据提示处理` }
                        },
                        {
                            cmd: `git push`,
                            config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
                        }
                    ])
                } else {
                    cmd[type] = cmd[type].concat(
                        !level || level < 3
                            ? [
                                  `git checkout ${config.release}`,
                                  `git pull`,
                                  `git checkout ${config.bugfix}`,
                                  `git pull`,
                                  {
                                      cmd: `git merge --no-ff ${config.release}`,
                                      config: { slient: false, again: false, postmsg: opt.postmsg, success: `${config.release}合并到${config.bugfix}成功`, fail: `${config.release}合并到${config.bugfix}出错了，请根据提示处理` }
                                  },
                                  {
                                      cmd: `git push`,
                                      config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
                                  }
                              ]
                            : [
                                  {
                                      cmd: `curl -i -H "Content-Type: application/json" -X POST -d "{\\"source_branch\\":\\"${config.release}\\",\\"target_branch\\":\\"${config.bugfix}\\",\\"private_token\\":\\"${token}\\",\\"title\\":\\"Merge branch '${config.release}' into '${config.bugfix}'\\"}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`,
                                      config: { slient: false, again: true, success: '成功创建合并请求', fail: '创建合并请求出错了，请根据提示处理' }
                                  },
                                  `gitm postmsg "${nickname}在${appName}项目提交了${config.release}分支合并到${config.bugfix}分支的merge请求"`
                              ]
                    )
                }
            }
            // 回到当前分支
            for (let key in cmd) {
                cmd[key].push(`git checkout ${curBranch}`)
            }
            queue(cmd[type])
        } else {
            sh.echo(error('type只允许输入：' + opts.join(',')))
            sh.exit(1)
        }
    })
}

if (update.args.length > 0) {
    let _program = program
        .name('gitm admin')
        .usage('<command> <type> [-m --mode [mode]]')
        .description('更新bugfix、release、support分支代码')
        .command('update ' + createArgs(update.args))
    update.options.forEach(o => {
        _program.option(o.flags, o.description, o.defaultValue)
    })
    // .command('update <type>')
    // .option('--use-rebase', '是否使用rebase方式更新，默认merge', false)
    // .option('-m, --mode [mode]', '出现冲突时，保留传入代码还是保留当前代码；1=采用当前 2=采用传入；默认为 0=手动处理。本参数不可与--use-rebase同时使用', 0)
    // .option('--postmsg', '发送消息', false)
    _program.action((type, opt) => {
        const opts = ['bugfix', 'release', 'support'] // 允许执行的指令
        let base = type === 'release' ? config.master : config.release,
            mode = '', // 冲突时，保留哪方代码
            status = getStatus()
        if (!status) sh.exit(1)
        if (opt.mode === 1) {
            mode = ' --strategy-option ours'
        } else if (opt.mode === 2) {
            mode = ' --strategy-option theirs'
        }
        if (opts.includes(type)) {
            let cmd =
                !level || level < 3
                    ? [
                          `git fetch`,
                          `git checkout ${base}`,
                          `git pull`,
                          `git checkout ${config[type]}`,
                          {
                              cmd: `git pull`,
                              config: { slient: false, again: true }
                          },
                          {
                              cmd: `git merge --no-ff ${base}${mode}`,
                              config: { slient: false, again: false, postmsg: opt.postmsg, success: `${base}同步到${config[type]}成功`, fail: `${base}同步到${config[type]}出错了，请根据提示处理` }
                          },
                          {
                              cmd: `git push`,
                              config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
                          }
                      ]
                    : [
                          {
                              cmd: `curl -i -H "Content-Type: application/json" -X POST -d "{\\"source_branch\\":\\"${base}\\",\\"target_branch\\":\\"${config[type]}\\",\\"private_token\\":\\"${token}\\",\\"title\\":\\"Merge branch '${base}' into '${config[type]}'\\"}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`,
                              config: { slient: false, again: true, success: '成功创建合并请求', fail: '创建合并请求出错了，请根据提示处理' }
                          },
                          `gitm postmsg "${nickname}在${appName}项目提交了${base}分支合并到${config[type]}分支的merge请求"`
                      ]
            if (opt.useRebase) {
                cmd = [
                    `git fetch`,
                    `git checkout ${base}`,
                    `git pull`,
                    `git checkout ${config[type]}`,
                    {
                        cmd: `git pull origin ${config[type]} --rebase`,
                        config: { slient: false, again: true }
                    },
                    {
                        cmd: `git rebase ${base}`,
                        config: { slient: false, again: false, postmsg: opt.postmsg, success: `${base}同步到${config[type]}成功`, fail: `${base}同步到${config[type]}出错了，请根据提示处理` }
                    },
                    {
                        cmd: `git push`,
                        config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
                    }
                ]
            }
            queue(cmd)
        } else {
            sh.echo(error('type只允许输入：' + opts.join(',')))
            sh.exit(1)
        }
    })
}

if (clean.args.length > 0) {
    let _program = program
        .name('gitm admin')
        .usage('<command> <type>')
        .description('构建清理工作')
        .command('clean ' + createArgs(clean.args))
    clean.options.forEach(o => {
        _program.option(o.flags, o.description, o.defaultValue)
    })
    // .command('clean <type>')
    _program.action(type => {
        const opts = ['bugfix', 'release', 'develop', 'master'] // 允许执行的指令
        let status = getStatus()
        if (!status) sh.exit(1)
        if (opts.includes(type)) {
            let cmd = [`git fetch`, `git checkout . -f`, `git clean -fd`, `git checkout ${config.master}`, `git branch -D ${config[type]}`, `git fetch`, `git checkout ${config[type]}`, `git pull`]
            if (type === 'master') cmd = [`git checkout .`, `git clean -fd`, `git checkout ${config.master}`, `git clean -fd`, `git fetch`, `git pull`]
            queue(cmd)
        } else {
            sh.echo(error('type只允许输入：' + opts.join(',')))
            sh.exit(1)
        }
    })
}
program.parse(process.argv)
