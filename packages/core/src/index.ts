export { enUS, zhCN } from '#lib/locales'
// export type { TranslatePair, Language } from '#lib/locales'

export { default as getCurlOfMergeRequest } from './getCurlOfMergeRequest'
export { getMessage, postMessage } from './message'
export { wait, queue } from './queue'
export { default as sendGroupMessage } from './sendGroupMessage'
export { isNeedUpgrade, upgradeGitmars } from './versionControl'

export { default } from './index.default'
export type * from './index.default'
export const version = '__VERSION__' as string
