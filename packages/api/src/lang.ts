import { osLangSync } from 'os-lang'
import { useLocale } from '@gitmars/utils'
import * as languages from './locales'

export type LanguageType = Exclude<keyof typeof languages, 'default'>

const locales: LanguageType[] = ['enUS', 'zhCN']
let locale = (process.env.GITMARS_LANG || osLangSync()).replace('-', '') as LanguageType
if (!locales.includes(locale)) locale = 'enUS'

export default useLocale(languages[locale])
