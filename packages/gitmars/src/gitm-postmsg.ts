#!/usr/bin/env ts-node
import { program } from 'commander'
import sendGroupMessage from '@gitmars/core/lib/sendGroupMessage'
import { createArgs } from '@gitmars/core/lib/utils/command'
import type { GitmarsOptionOptionsType } from '../typings/gitmars'
import lang from '#lib/common/local'
import postmsgConfig from '#lib/conf/postmsg'

const { t } = lang
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
	.description(t('Send group message'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
	program.option(o.flags, o.description, o.defaultValue)
})
// .option('-u, --url [url]', t('The api address of the push message'), '')
program.action((message: string, opt: GitmBuildOption) => {
	sendGroupMessage(message, opt.url || '')
})
program.parse(process.argv)
export {}
