#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { options, args } = require('./conf/end')
const { error, queue, getStatus, getCurrent, searchBranch, createArgs } = require('./js/index')
const config = require('./js/getConfig')()
const { getUserToken } = require('./js/api')
const { defaults } = require('./js/global')
/**
 * gitm end
 */
program.name('gitm end').usage('[type] [name]').description('合并bugfix任务分支、合并feature功能开发分支，合并完成后将删除对应分支')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach(o => {
    program.option(o.flags, o.description, o.defaultValue)
})
program.action(async (type, name, opt) => {
    const allow = ['bugfix', 'feature', 'support'] // 允许执行的指令
    const deny = [defaults.master, defaults.develop, defaults.release, defaults.bugfix, defaults.support]
    const { token, level = 3 } = getUserToken() || {}
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
        let base = type === 'bugfix' ? config.bugfix : config.release,
            cmd = [
                `git fetch`,
                `git checkout ${config.develop}`,
                `git pull`,
                {
                    cmd: `git merge --no-ff ${type}/${name}`,
                    config: { slient: false, again: false, success: `${type}/${name}合并到${config.develop}成功`, fail: `${type}/${name}合并到${config.develop}出错了，请根据提示处理` }
                },
                {
                    cmd: `git push`,
                    config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
                },
                `git checkout ${type}/${name}`
            ]
        // support分支需要合到bugfix
        if (type === 'support') {
            cmd = cmd.concat(
                level < 3
                    ? [
                          `git fetch`,
                          `git checkout ${config.bugfix}`,
                          `git pull`,
                          {
                              cmd: `git merge --no-ff ${type}/${name}`,
                              config: { slient: false, again: false, success: `${type}/${name}合并到${config.bugfix}成功`, fail: `${type}/${name}合并到${config.bugfix}出错了，请根据提示处理` }
                          },
                          {
                              cmd: `git push`,
                              config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
                          },
                          `git checkout ${type}/${name}`
                      ]
                    : [
                          {
                              cmd: `curl -i -H "Content-Type: application/json" -X POST -d '{"source_branch":"'${type}/${name}'","target_branch":"'${config.bugfix}'","private_token":"'${token}'","title":"Merge branch '${type}/${name}' into '${config.bugfix}'"}' "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`,
                              config: { slient: false, again: true, success: '成功创建合并请求', fail: '创建合并请求出错了，请根据提示处理' }
                          }
                      ]
            )
        }
        cmd = cmd.concat(
            level < 3
                ? [
                      `git fetch`,
                      `git checkout ${base}`,
                      `git pull`,
                      {
                          cmd: `git merge --no-ff ${type}/${name}`,
                          config: { slient: false, again: false, success: `${type}/${name}合并到${base}成功`, fail: `${type}/${name}合并到${base}出错了，请根据提示处理` }
                      },
                      {
                          cmd: `git push`,
                          config: { slient: false, again: true, success: '推送成功', fail: '推送失败，请根据提示处理' }
                      },
                      `git branch -D ${type}/${name}`,
                      `git checkout ${config.develop}`
                  ]
                : [
                      {
                          cmd: `curl -i -H "Content-Type: application/json" -X POST -d '{"source_branch":"'${type}/${name}'","target_branch":"'${base}'","private_token":"'${token}'","title":"Merge branch '${type}/${name}' into '${base}'"}' "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`,
                          config: { slient: false, again: true, success: '成功创建合并请求', fail: '创建合并请求出错了，请根据提示处理' }
                      }
                  ]
        )
        queue(cmd)
    } else {
        sh.echo(error('type只允许输入：' + JSON.stringify(allow)))
        sh.exit(1)
    }
})
program.parse(process.argv)
