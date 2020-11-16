#!/usr/bin/env node
const program = require('commander')
const { options, args } = require('./conf/postmsg')
const { sendMessage, createArgs } = require('./js/index')
/**
 * gitm postmsg
 */
program.name('gitm postmsg').usage('[message]').description('发送消息到云之家')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach(o => {
	program.option(o.flags, o.description, o.defaultValue)
})
program.action(message => {
	sendMessage(message, { silent: false })
})
program.parse(process.argv)
