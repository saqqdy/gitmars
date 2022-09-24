export { default as zhCN } from '#lib/locales/zh-CN'
export { default as enUS } from '#lib/locales/en-US'

export interface TranslatePair {
    [key: string]: string | string[] | TranslatePair
}
export interface Language extends Record<string, string | TranslatePair> {
    name: string
    // base?: TranslatePair
}
