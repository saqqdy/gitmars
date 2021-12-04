#!/usr/bin/env ts-node
const { program } = require('commander')
const sh = require('shelljs')
const { getCurrentBranch } = require('./core/git/index')
const { error } = require('./core/utils/index')
const getConfig = require('./core/getConfig')
const { spawnSync } = require('./core/spawn')
const config = getConfig()

interface GitmBuildOption {
    noVerify?: boolean
    dev?: boolean
    release?: boolean
}

/**
 * gitm permission
 */
program
    .name('gitm permission')
    .usage('[message] [--no-verify] [--dev] [--release]')
    .arguments('[message]')
    .description('校验提交权限')
    .option('--no-verify', '是否需要跳过校验权限', false)
    .option('--dev', '是否限制dev提交', false)
    .option('--release', '是否限制release提交', false)
    .action((message: string, opt: GitmBuildOption) => {
        console.info('gitm permission is running')
        const current = getCurrentBranch()
        const allow = [config.master]
        const { stdout } = spawnSync('git', ['show'])
        if (opt.dev) allow.push(config.develop)
        if (opt.release) allow.push(config.release)
        const index = allow.indexOf(current)
        if (
            index > -1 &&
            !opt.noVerify &&
            stdout &&
            stdout.indexOf('Merge:') === -1 &&
            stdout.indexOf('Merge branch') === -1
        ) {
            sh.echo(error(`${allow[index]}分支不允许直接提交`))
            process.exit(1)
        } else {
            process.exit(0)
        }
        // sh.echo(process.env.HUSKY_GIT_PARAMS)
        // sh.echo(process.env.FORCE_COMMIT)
    })
program.parse(process.argv)
export {}
