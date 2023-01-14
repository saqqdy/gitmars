const { statSync, readdirSync, readFileSync, writeFileSync } = require('fs')
const { join } = require('path')
const argv = process.argv.slice(2)

const sets: unknown[] = []
const absPath = require.resolve('gitmars/package.json').replace(/package\.json$/, '')

// const readDir = (entry: string) => {
//     const dirInfo = readdirSync(entry)
//     dirInfo.forEach((fileName: string) => {
//         const name = join(entry, fileName)
//         const info = statSync(name)
//         if (info.isDirectory()) {
//             readDir(name)
//         } else {
//             ;/\.js$/.test(fileName) && getInfo(fileName, name)
//         }
//     })
// }
// function getInfo(name: string, url: string) {
//     sets.push(url)
// }
// readDir(argv[0] || join(absPath, 'lib', 'conf'))

// writeFileSync(
//     join(__dirname, '..', 'src', 'config.json'),
//     JSON.stringify(sets, null, 2)
// )

const FILE_NAME = join(__dirname, '..', 'src', 'views', 'control', 'gitmSets.ts')
let codes = readFileSync(FILE_NAME).toString()
writeFileSync(
	FILE_NAME,
	codes.replace('gitmars/lib/conf/*.js', join(absPath, 'lib', 'conf', '*.js'))
)
