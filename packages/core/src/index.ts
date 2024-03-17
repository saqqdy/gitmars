// export { default as hook } from '#lib/hook'

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

export { enUS, zhCN } from '#lib/locales'
export type { TranslatePair, Language } from '#lib/locales'

export { default } from './index.default'
export const version = '__VERSION__' as string
