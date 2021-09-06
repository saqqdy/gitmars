#!/usr/bin/env node
import { program } from 'commander'
import sh from 'shelljs'
import { options, args } from './conf/continue'
import { error, queue, getCache, isGitProject } from './js/index'
import { createArgs } from './js/tools'
if (!isGitProject()) {
    sh.echo(error('当前目录不是git项目目录'))
    sh.exit(1)
}
/**
 * gitm continue
 */
program.name('gitm continue').usage('[-l --list]').description('继续未完成的操作')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach(o => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-l, --list', '显示指令队列', false)
program.action(opt => {
    let cmd = getCache()
    if (opt.list) {
        sh.echo(cmd)
        sh.exit(0)
    }
    if (cmd.length > 0) {
        queue(cmd)
    } else {
        sh.echo(error('队列里面没有未执行的指令'))
    }
})
program.parse(process.argv)
