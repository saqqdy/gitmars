import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs'
import { createRequire } from 'node:module'
// import lang from '../packages/gitmars/src/locales/zh-CN.json' assert { type: 'json' }
const require = createRequire(import.meta.url)

global.__filename = fileURLToPath(import.meta.url)
global.__dirname = dirname(__filename)

const [, , srcpath] = process.argv
const lang = require(resolve(srcpath, 'locales', 'zh-CN.json'))

function replaceI18n(file) {
    const langEntries = Object.entries(lang)
    // const file = resolve(__dirname, '..', path)
    let text = readFileSync(file, 'utf8')

    for (const langMap of langEntries) {
        text = text.replace(
            new RegExp(`'${langMap[1]}'`, 'g'),
            `i18n.__('${langMap[0]}')`
        )
    }
    writeFileSync(file, text)
}

const readDir = entry => {
    const dirInfo = readdirSync(entry)
    dirInfo.forEach(item => {
        const name = resolve(entry, item)
        const info = statSync(name)
        if (info.isDirectory()) {
            readDir(name)
        } else {
            const fileName = name.split('/').reverse()
            if (
                /^[\S]*\.(mjs|ts)$/.test(fileName[0]) &&
                !name.includes('node_modules')
            )
                replaceI18n(name)
        }
    })
}

if (srcpath) readDir(srcpath || 'packages/gitmars/src')
else {
    console.info('srcpath is empty')
    process.exit(0)
}
