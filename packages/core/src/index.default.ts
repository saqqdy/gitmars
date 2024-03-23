// import hook from '#lib/hook'

// const {
// 	init,
// 	remove,
// 	createHooks,
// 	removeHooks,
// 	createHookShell,
// 	removeHookShell,
// 	createLocalShell,
// 	removeLocalShell
// } = hook

import { enUS, zhCN } from './locales'
export type { TranslatePair, Language } from './locales'
import { getMessage, postMessage } from './message'

export default {
	version: '__VERSION__',
	// hook
	// init,
	// remove,
	// createHooks,
	// removeHooks,
	// createHookShell,
	// removeHookShell,
	// createLocalShell,
	// removeLocalShell,
	// locales
	zhCN,
	enUS,
	getMessage,
	postMessage
}
