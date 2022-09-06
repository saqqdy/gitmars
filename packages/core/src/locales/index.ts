const { join } = require('path')
const { I18n } = require('i18n')
// const { osLocale } = require('os-locale')

const locales = ['en-US', 'zh-CN']
// const locale = await osLocale()
const locale = 'zh-CN'
const i18n = new I18n({
    locales,
    fallbacks: { 'en-*': 'en-US', 'zh-*': 'zh-CN' },
    defaultLocale: locales.includes(locale) ? locale : 'en-US',
    directory: join(__dirname, '.')
})

export default i18n
