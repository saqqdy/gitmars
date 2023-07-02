import { osLangSync } from 'os-lang'
import { useLocale } from '#lib/utils/local'
import * as languages from '#lib/locales/index'

export type LanguageType = Exclude<keyof typeof languages, 'default'>

const locales: LanguageType[] = ['enUS', 'zhCN']
let locale = (process.env.GITMARS_LANG || osLangSync()).replace('-', '') as LanguageType
if (!locales.includes(locale)) locale = 'enUS'

export default useLocale(languages[locale])
