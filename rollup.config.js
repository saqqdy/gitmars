import fs from 'fs'
import path from 'path'
import resolve from '@rollup/plugin-node-resolve'
// import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import esbuild from 'rollup-plugin-esbuild'
// import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
// import typescript from 'rollup-plugin-typescript2'
import shebang from 'rollup-plugin-preserve-shebang'
import { visualizer } from 'rollup-plugin-visualizer'
import pkg from './package.json'

const isDev = process.env.BUILD_ENV === 'dev'
const config = require('./config')
const deps = Object.keys(pkg.dependencies)

let cjsList = []
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

const getOutFile = (name, dir = 'lib') => {
    return name.replace(/^bin/, dir).replace(/\.ts$/, '.js')
}

const production = !process.env.ROLLUP_WATCH

export default cjsList.map(filePath => ({
    input: path.resolve(__dirname, filePath),
    output: [
        // {
        //     format: 'es',
        //     file: getOutFile(filePath, 'es'),
        //     exports: 'auto',
        //     sourcemap: false
        // },
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
			shebang: '#!/usr/bin/env node'
		}),
        // commonjs({
        //     sourceMap: false
        // }),
        json(),
        // typescript({
        //     tsconfigOverride: {
        //         compilerOptions: {
        //             declaration: false,
        //             target: 'es6'
        //         },
        //         include: ['bin/**/*.ts'],
        //         exclude: ['node_modules', '__tests__', 'core-js', 'js-cool', 'axios']
        //     },
        //     abortOnError: false
        // }),
        // babel({
        //     babelHelpers: 'bundled',
        //     extensions: config.extensions,
        //     exclude: [/\/core-js\//, 'node_modules/**'],
        //     // runtimeHelpers: true,
        //     sourceMap: true
        // }),
        esbuild(),
        visualizer(),
        !isDev && terser()
    ],
    external(id) {
        return ['regenerator-runtime'].some(k => new RegExp('^' + k).test(id)) || deps.some(k => new RegExp('^' + k).test(id))
    }
}))
