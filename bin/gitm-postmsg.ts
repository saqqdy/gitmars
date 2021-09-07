#!/usr/bin/env node
import { program } from 'commander'
import { options, args } from './conf/postmsg'
import sendGroupMessage from './js/sendGroupMessage'
import { createArgs } from './js/tools'
import { encodeUnicode } from './js/unicode'
/**
 * gitm postmsg
 */
program.name('gitm postmsg').usage('<message> [-u --url [url]]').description('发送群消息消息')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach(o => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-u, --url [url]', '推送消息的api地址', '')
program.action((message, opt) => {
    sendGroupMessage(encodeUnicode(message), { url: opt.url || '' })
})
program.parse(process.argv)
