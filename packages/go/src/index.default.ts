import cleanConfigSet from './cleanConfigSet'
import createPrompt from './createPrompt'
import getCommand from './getCommand'

export type { GoCleanConfigType } from './cleanConfigSet'
export type { PromptConfigType } from './createPrompt'
export type { CommandNeedInput } from './getCommand'
export type * from './types'
export default {
	version: '__VERSION__',
	cleanConfigSet,
	createPrompt,
	getCommand
}
