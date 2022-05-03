#!/usr/bin/env ts-node
import type { GitmarsOptionOptionsType } from '../typings'
const { program } = require('commander')
const sendGroupMessage = require('@gitmars/core/sendGroupMessage')
const { createArgs } = require('@gitmars/core/utils/command')
const { options, args } = require('./conf/postmsg')

interface GitmBuildOption {
    url?: string
}

/**
 * gitm postmsg
 */
program
    .name('gitm postmsg')
    .usage('<message> [-u --url [url]]')
    .description('发送群消息')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-u, --url [url]', '推送消息的api地址', '')
program.action((message: string, opt: GitmBuildOption) => {
    sendGroupMessage(message, opt.url || '')
})
program.parse(process.argv)
export {}
