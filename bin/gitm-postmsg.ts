#!/usr/bin/env ts-node
const { program } = require('commander')
const { options, args } = require('./conf/postmsg')
const sendGroupMessage = require('./js/sendGroupMessage')
const { createArgs } = require('./js/utils/index')
const { encodeUnicode } = require('./js/unicode')

import { GitmarsOptionOptionsType } from '../typings'

interface GitmBuildOption {
    url?: string
}

/**
 * gitm postmsg
 */
program
    .name('gitm postmsg')
    .usage('<message> [-u --url [url]]')
    .description('发送群消息消息')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-u, --url [url]', '推送消息的api地址', '')
program.action((message: string, opt: GitmBuildOption) => {
    sendGroupMessage(encodeUnicode(message), { url: opt.url || '' })
})
program.parse(process.argv)
export {}
