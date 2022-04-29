import { resolve } from 'path'
import { parallel, series } from 'gulp'
import { rollup } from 'rollup'
import alias from '@rollup/plugin-alias'
import type { OutputOptions } from 'rollup'
import type { ResolverObject } from '@rollup/plugin-alias'
import { wrapDisplayName } from '../utils/gulp'
import {
    banner,
    commonjs,
    esbuild,
    filesize,
    minify,
    nodeResolve
} from '../plugins/index'
import { external, pathRewriter } from '../utils/rollup'
import { bundleConfig } from '../buildConfig'
import config from '../config'
import { getPaths } from '../utils/glob'
import { LOCALE_PATH, OUTPUT_BUNDLE_PATH, ROOT_PATH } from '../utils/paths'

const LANG_PATH = resolve(LOCALE_PATH, 'lang')

export async function buildLocale() {
    const langs = getPaths('*', {
        cwd: LANG_PATH
    })
    const buildTasks = langs.map(async lang => {
        const { path: input, name: fileName } = lang
        const rollupConfig = {
            input,
            plugins: [
                alias({
                    entries: [
                        {
                            find: /^@\//,
                            replacement: ROOT_PATH + '/packages/'
                        }
                    ],
                    customResolver: nodeResolve() as ResolverObject
                }),
                commonjs,
                nodeResolve(),
                esbuild()
            ],
            external
        }
        const writeOptions = bundleConfig.map(
            ({ name, format, globals, bundlePath }): OutputOptions => ({
                format,
                file: resolve(
                    OUTPUT_BUNDLE_PATH,
                    'lang',
                    fileName.replace(
                        /\.ts$/i,
                        format === 'umd' ? '.js' : '.mjs'
                    )
                ),
                exports: format === 'umd' ? 'named' : 'auto',
                name,
                globals,
                paths: pathRewriter(bundlePath),
                banner: config.banner,
                plugins: [filesize]
            })
        )
        const writeMinifyOptions = bundleConfig.map(
            ({ name, format, globals, bundlePath }): OutputOptions => ({
                format,
                file: resolve(
                    OUTPUT_BUNDLE_PATH,
                    'lang',
                    fileName.replace(
                        /\.ts$/i,
                        format === 'umd' ? '.min.js' : '.min.mjs'
                    )
                ),
                paths: pathRewriter(bundlePath),
                exports: format === 'umd' ? 'named' : 'auto',
                name,
                globals,
                sourcemap: true,
                plugins: [
                    minify({
                        minify: true
                    }),
                    banner(),
                    filesize
                ]
            })
        )
        const bundle = await rollup(rollupConfig)
        await Promise.all(writeOptions.map(option => bundle.write(option)))
        await Promise.all(
            writeMinifyOptions.map(option => bundle.write(option))
        )
    })
    await Promise.all(buildTasks)
}

export default series(parallel(wrapDisplayName('build:locale', buildLocale)))
