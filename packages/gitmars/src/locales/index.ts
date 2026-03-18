export { default as enUS } from './en-US'
export { default as zhCN } from './zh-CN'

export interface TranslatePair {
	[key: string]: string | string[] | TranslatePair
}
export interface Language extends Record<string, string | TranslatePair> {
	name: string
	// base?: TranslatePair
}
