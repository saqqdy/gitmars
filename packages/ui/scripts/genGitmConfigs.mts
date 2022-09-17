import { createRequire } from 'node:module'
import { statSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'


const require = createRequire(import.meta.url)
const argv = process.argv.slice(2)
const sets: unknown[] = []
const absPath = dirname(require.resolve('gitmars/package.json'))

// const readDir = (entry: string) => {
//     const dirInfo = readdirSync(entry)
//     dirInfo.forEach((fileName: string) => {
//         const name = join(entry, fileName)
//         const info = statSync(name)
//         if (info.isDirectory()) {
//             readDir(name)
//         } else {
//             ;/\.mjs$/.test(fileName) && getInfo(fileName, name)
//         }
//     })
// }
// function getInfo(name: string, url: string) {
//     sets.push(url)
// }
// readDir(argv[0] || join(absPath, 'lib', 'conf'))
const config = await import(join(absPath, 'lib', 'conf', 'index.mjs') as string)
console.log(sets, absPath, config)

// writeFileSync(
//     join(__dirname, '..', 'src', 'config.json'),
//     JSON.stringify(sets, null, 2)
// )

// const FILE_NAME = join(
//     __dirname,
//     '..',
//     'src',
//     'views',
//     'control',
//     'gitmSets.ts'
// )
// let codes = readFileSync(FILE_NAME).toString()
// writeFileSync(
//     FILE_NAME,
//     codes.replace('gitmars/lib/conf/*.js', join(absPath, 'lib', 'conf', '*.js'))
// )
