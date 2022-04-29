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
    cssOnly,
    esbuild,
    filesize,
    json,
    minify,
    nodeResolve,
    vue,
    vueJsx
    // visual,
} from '../plugins/index'
import { run } from '../utils/exec'
import { external, pathRewriter } from '../utils/rollup'
import { bundleConfig } from '../buildConfig'
import config from '../config'
import { OUTPUT_BUNDLE_PATH, ROOT_PATH } from '../utils/paths'

export async function buildFull() {
    const input = resolve(ROOT_PATH, 'packages/index.ts')
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
            json,
            commonjs,
            nodeResolve(),
            cssOnly,
            vue(),
            vueJsx,
            esbuild()
        ],
        external
    }
    const writeOptions = bundleConfig.map(
        ({ name, format, globals, bundlePath }): OutputOptions => ({
            format,
            file: resolve(
                OUTPUT_BUNDLE_PATH,
                `index.full.${format === 'umd' ? 'js' : 'mjs'}`
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
                `index.full.min.${format === 'umd' ? 'js' : 'mjs'}`
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
    await Promise.all(writeMinifyOptions.map(option => bundle.write(option)))
}

export async function genVersion() {
    await run(`pnpm gen:version`)
}

export default series(
    // wrapDisplayName('gen:version', genVersion),
    parallel(wrapDisplayName('build:full:bundle', buildFull))
)
