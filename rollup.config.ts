import fs from 'fs'
import path from 'path'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import esbuild from 'rollup-plugin-esbuild'
import commonjs from '@rollup/plugin-commonjs'
import shebang from 'rollup-plugin-replace-shebang'
import { visualizer } from 'rollup-plugin-visualizer'
import pkg from './package.json'

const isDev = process.env.BUILD_ENV === 'dev'
const config = require('./config')
const deps = Object.keys(pkg.dependencies)

const cjsList = []
const readDir = entry => {
    const dirInfo = fs.readdirSync(entry)
    dirInfo.forEach(item => {
        const name = path.join(entry, item)
        const info = fs.statSync(name)
        if (info.isDirectory()) {
            readDir(name)
        } else {
            ;/^[\S]*\.ts$/.test(item) && getInfo(name)
        }
    })
}
const getInfo = url => {
    cjsList.push(url)
}
readDir('./bin')

const getOutFile = (name, dir = 'lib', suffix = '') => {
    return name.replace(/^bin/, dir).replace(/\.ts$/, suffix + '.js')
}

const onwarn = (warning, rollupWarn) => {
    const ignoredWarnings = [
        {
            ignoredCode: 'CIRCULAR_DEPENDENCY',
            ignoredPath: 'node_modules/js-cool/lib/'
        }
    ]
    // only show warning when code and path don't match
    if (
        !ignoredWarnings.some(
            ({ ignoredCode, ignoredPath }) =>
                warning.code === ignoredCode &&
                warning.importer.includes(path.normalize(ignoredPath))
        )
    ) {
        rollupWarn(warning)
    }
}

const production = !process.env.ROLLUP_WATCH

export default cjsList.map(filePath => ({
    input: path.resolve(__dirname, filePath),
    onwarn,
    output: [
        {
            format: 'cjs',
            file: getOutFile(filePath, 'lib'),
            exports: 'auto',
            // exports: 'named',
            sourcemap: false
        }
    ],
    plugins: [
        resolve({ extensions: config.extensions, preferBuiltins: false }),
        shebang({
            shebang: '#!/usr/bin/env node',
            skipBackslash: true // 跳过\u005c 反斜杠
        }),
        commonjs({
            sourceMap: false
        }),
        json(),
        esbuild({
            target: 'es2017',
            minify: false // 避免\u005c被转码
        }),
        visualizer()
    ],
    external(id) {
        return (
            ['regenerator-runtime'].some(k => new RegExp('^' + k).test(id)) ||
            deps.some(k => new RegExp('^' + k).test(id))
        )
    }
}))
