/**
 * @Description:
 * @Author:
 * @LastEditors: saqqdy
 * @Date: 2021-07-22 22:39:42
 * @LastEditTime: 2021-11-30 14:41:08
 */
const fs = require('fs')
const path = require('path')
const argvs = process.argv.slice(2)
const builder = require('esbuild')

const readDir = entry => {
    const dirInfo = fs.readdirSync(entry)
    dirInfo.forEach(fileName => {
        const name = path.join(entry, fileName)
        const info = fs.statSync(name)
        if (info.isDirectory()) {
            readDir(name)
        } else {
            ;/^[\S]*\.(ts|js)$/.test(fileName) && getInfo(name)
        }
    })
}
const getInfo = url => {
    builder
        .build({
            entryPoints: [url],
            bundle: false,
            platform: 'node',
            target: 'node8.4',
            outfile: url.replace(/^bin\//, 'lib/')
        })
        .catch(() => process.exit(1))
}
readDir(argvs[0] || 'bin')
