#!/usr/bin/env ts-node
import { program } from 'commander'
import sendGroupMessage from '@gitmars/core/lib/sendGroupMessage'
import { createArgs } from '@gitmars/core/lib/utils/command'
import type { GitmarsOptionOptionsType } from '../typings'
import postmsgConfig from '#lib/conf/postmsg'
import i18n from '#lib/locales/index'

const { args, options } = postmsgConfig

interface GitmBuildOption {
    url?: string
}

/**
 * gitm postmsg
 */
program
    .name('gitm postmsg')
    .usage('<message> [-u --url [url]]')
    .description(i18n.__('Send group message'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-u, --url [url]', i18n.__('The api address of the push message'), '')
program.action((message: string, opt: GitmBuildOption) => {
    sendGroupMessage(message, opt.url || '')
})
program.parse(process.argv)
export {}
