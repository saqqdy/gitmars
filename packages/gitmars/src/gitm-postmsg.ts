import type { GitmarsOptionOptionsType } from './types'
import { sendGroupMessage } from '@gitmars/core'
import { createArgs } from '@gitmars/utils'
import { program } from 'commander'
import lang from './common/local'
import postmsgConfig from './conf/postmsg'

const { t } = lang
const { args, options } = postmsgConfig

interface GitmPostmsgOption {
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
program.action((message: string, opt: GitmPostmsgOption) => {
	sendGroupMessage(message, opt.url || '')
})
program.parse(process.argv)
export {}
