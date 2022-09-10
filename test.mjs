import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import chalk from 'chalk'
import { I18n } from 'i18n'
import { osLocale } from 'os-locale'
// import conf from './packages/gitmars/lib/conf/admin.mjs'
// import { createRequireFromPath } from 'module';
// const require = createRequireFromPath(__filename);

const locales = ['en-US', 'zh-CN']
const locale = await osLocale()

global.__filename = fileURLToPath(import.meta.url)
global.__dirname = dirname(__filename)

console.log(
    // conf,
    chalk.green('test'),
    import.meta.url,
    __filename,
    __dirname,
    fileURLToPath(import.meta.url),
    locale
)

const i18n = new I18n({
    locales,
    fallbacks: { 'en-*': 'en-US', 'zh-*': 'zh-CN' },
    defaultLocale: locales.includes(locale) ? locale : 'en-US',
    directory: join(__dirname, 'packages', 'gitmars', 'src', 'locales')
})

console.log(i18n.__('Send group message'))
