import fs from 'fs'
import { join } from 'path'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'
import { visualizer } from 'rollup-plugin-visualizer'
import pkg from './package.json'

const config = require('./config')

let fileList = []
const readDir = entry => {
    const dirInfo = fs.readdirSync(entry)
    dirInfo.forEach(item => {
        const name = join(entry, item)
        const info = fs.statSync(name)
        if (info.isDirectory()) {
            readDir(name)
        } else {
            ;/^[\S]*\.ts$/.test(item) && getInfo(name)
        }
    })
}
const getInfo = url => {
    fileList.push(url)
}
readDir('./bin/conf')

const production = !process.env.ROLLUP_WATCH

export default [
    {
        input: fileList,
        output: [
            {
                // file: 'lib/[name].js',
                // dir: 'lib',
			paths(id) {
				console.log(id)
			},
                preserveModules: true,
                preserveModulesRoot: 'src',
                exports: 'auto',
                format: 'cjs',
                sourcemap: false
            },
        //     {
        //         // file: 'lib/index.esm.js',
        //         dir: 'lib',
        //         preserveModules: true,
        //         preserveModulesRoot: 'src',
        //         exports: 'auto',
        //         format: 'es',
        //         sourcemap: false
        //     }
        // ],
        plugins: [
            resolve({
                // Use the `package.json` "browser" field
                browser: true,
                // Resolve .mjs and .js files
                extensions: ['.mjs', '.js'],
                // Prefer node.js built-ins instead of npm packages
                preferBuiltins: true,
                customResolveOptions: {
                    moduleDirectories: ['node_modules']
                }
            }),
            commonjs({
                sourceMap: false
            }),
            json(),
            typescript({
                tsconfigOverride: {
                    compilerOptions: {
                        declaration: false,
                        target: 'es6'
                    },
                    include: ['src/**/*.ts'],
                    exclude: ['node_modules', '__tests__', 'core-js', 'js-cool', 'axios']
                },
                abortOnError: false
            }),
            babel({
                babelHelpers: 'bundled',
                extensions: config.extensions,
                exclude: [/\/core-js\//, 'node_modules/**'],
                // runtimeHelpers: true,
                sourceMap: true
            }),
            visualizer()
        ],
        external(id) {
            return ['core-js', 'axios', 'js-cool', 'regenerator-runtime'].some(k => new RegExp('^' + k).test(id))
        }
    }
]
