import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { I18n } from 'i18n'
import { osLocale } from 'os-locale'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const locales = ['en-US', 'zh-CN']
const locale = process.env.GITMARS_LANG || (await osLocale())

const i18n = new I18n({
    locales,
    fallbacks: { 'en-*': 'en-US', 'zh-*': 'zh-CN' },
    defaultLocale: locales.includes(locale) ? locale : 'en-US',
    directory: join(__dirname, '.')
})

export default i18n
