#!/usr/bin/env ts-node
const { program } = require('commander')
const sh = require('shelljs')
const { error, getCurrent } = require('./js/index')
const getConfig = require('./js/getConfig')
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
        console.log('gitm permission is running')
        const current = getCurrent()
        const allow = [config.master]
        const msg = sh.exec('git show', { silent: true }).stdout
        if (opt.dev) allow.push(config.develop)
        if (opt.release) allow.push(config.release)
        const index = allow.indexOf(current)
        if (
            index > -1 &&
            !opt.noVerify &&
            msg &&
            msg.indexOf('Merge:') === -1 &&
            msg.indexOf('Merge branch') === -1
        ) {
            sh.echo(error(`${allow[index]}分支不允许直接提交`))
            sh.exit(1)
        } else {
            sh.exit(0)
        }
        // sh.echo(process.env.HUSKY_GIT_PARAMS)
        // sh.echo(process.env.FORCE_COMMIT)
    })
program.parse(process.argv)
export {}
