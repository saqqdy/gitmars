#!/usr/bin/env node
const { program } = require('commander')
const sh = require('shelljs')
const gitRevParse = require('./js/gitRevParse')
const { error, success, writeFile, isGitProject } = require('./js/index')
const { defaults } = require('./js/global')
if (!isGitProject()) {
    sh.echo(error('当前目录不是git项目目录'))
    sh.exit(1)
}
const getConfig = require('./js/getConfig')
const config = getConfig()
/**
 * gitm config set
 */
program
    .name('gitm config')
    .usage('<option> [value]')
    .command('set <option> [value]')
    .description('设置gitmars的配置项')
    .action(async (option, value) => {
        let { filepath } = config
        if (!filepath) {
            const { root } = gitRevParse()
            filepath = root + '/.gitmarsrc'
        }
        if (value) {
            if (Object.keys(defaults).includes(option)) {
                config[option] = value
                delete config.filepath
                delete config.skipCI
                await writeFile(filepath, JSON.stringify(config, null, 4))
                sh.echo(success('保存成功'))
                sh.exit(0)
            } else {
                sh.echo(error('不支持' + option + '这个配置项'))
                sh.exit(1)
            }
        } else {
            sh.echo('请输入要配置的项')
            sh.exit(1)
        }
    })
/**
 * gitm config list
 */
program
    .name('gitm config')
    .usage('list [option]')
    .command('list [option]')
    .description('查询单个或全部gitmars的配置项')
    .action(option => {
        if (option) {
            sh.echo(success(config[option]))
        } else {
            sh.echo(success(config))
        }
        sh.exit(0)
    })
program.parse(process.argv)
