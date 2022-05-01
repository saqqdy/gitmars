// import { parallel, series } from 'gulp'
// import { wrapDisplayName } from '../utils/gulp'
// import { run } from '../utils/exec'
// import { OUTPUT_CJS } from '../utils/paths'

import { resolve } from 'path'
import { parallel, series } from 'gulp'
import { rollup } from 'rollup'
import alias from '@rollup/plugin-alias'
import type { OutputOptions, RollupOptions } from 'rollup'
import type { ResolverObject } from '@rollup/plugin-alias'
import glob from 'fast-glob'
import { wrapDisplayName } from '../utils/gulp'
import {
    banner as bannerPlugin,
    commonjs,
    // cssOnly,
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
// import { external, pathRewriter } from '../utils/rollup'
// import { bundleConfig } from '../buildConfig'
// import config from '../config'
import { ROOT } from '../utils/paths'
import { packages } from '../packages'

export async function buildCjs() {
    const options: RollupOptions[] = []
    const externals = [
        'js-cool',
        '@gitmars/docs',
        '@gitmars/server',
        '@gitmars/ui'
    ]
    const builds = packages
        .filter(({ buildTask }) => buildTask === 'cjs')
        .map(
            async ({
                globals = {},
                name,
                external = [],
                submodules,
                iife,
                build,
                cjs,
                mjs,
                dts,
                target,
                exportType = 'auto'
            }) => {
                // if (build === false) return
                const pkg = require(`packages/${name}/package.json`)
                const banner =
                    '/*!\n' +
                    ' * ' +
                    pkg.name +
                    ' v' +
                    pkg.version +
                    '\n' +
                    ' * ' +
                    pkg.description +
                    '\n' +
                    ' * (c) 2021-' +
                    new Date().getFullYear() +
                    ' saqqdy<https://github.com/saqqdy> \n' +
                    ' * Released under the MIT License.\n' +
                    ' */'
                // const deps = Object.keys(pkg.dependencies || {})
                const iifeGlobals = {
                    'js-cool': 'JsCool',
                    '@gitmars/utils': 'EslintSets',
                    '@gitmars/core': 'EslintSets',
                    ...globals
                }
                const iifeName = 'EslintSets'
                const functionNames = ['index']

                // submodules
                if (submodules) {
                    functionNames.push(
                        ...glob
                            .sync('*/index.ts', {
                                cwd: resolve(`packages/${name}`)
                            })
                            .map(i => i.split('/')[0])
                    )
                }

                for (const fn of functionNames) {
                    const input =
                        fn === 'index'
                            ? `packages/${name}/index.ts`
                            : `packages/${name}/${fn}/index.ts`
                    const writeOptions: OutputOptions[] = []
                    // output mjs
                    if (mjs !== false) {
                        writeOptions.push({
                            file: `packages/${name}/dist/${fn}.mjs`,
                            // exports: 'auto',
                            exports: exportType,
                            banner,
                            format: 'es'
                        })
                    }
                    // output cjs
                    if (cjs !== false) {
                        writeOptions.push({
                            file: `packages/${name}/dist/${fn}.js`,
                            // exports: 'auto',
                            exports: exportType,
                            banner,
                            format: 'cjs'
                        })
                    }
                    // output iife
                    if (iife !== false) {
                        writeOptions.push(
                            {
                                file: `packages/${name}/dist/${fn}.iife.js`,
                                format: 'iife',
                                // exports: 'named',
                                // exports: exportType,
                                name: iifeName,
                                extend: true,
                                globals: iifeGlobals,
                                banner,
                                plugins: [
                                    // injectEslintSetsCore,
                                ]
                            },
                            {
                                file: `packages/${name}/dist/${fn}.iife.min.js`,
                                format: 'iife',
                                // exports: 'named',
                                // exports: exportType,
                                name: iifeName,
                                extend: true,
                                globals: iifeGlobals,
                                plugins: [
                                    // injectEslintSetsCore,
                                    minify({
                                        minify: true
                                    }),
                                    bannerPlugin(),
                                    filesize
                                ]
                            }
                        )
                    }

                    const rollupConfig = {
                        input,
                        plugins: [
                            alias({
                                entries: [
                                    {
                                        find: /^@\//,
                                        replacement: ROOT + '/packages/'
                                    }
                                ],
                                customResolver: nodeResolve() as ResolverObject
                            }),
                            json,
                            commonjs,
                            nodeResolve(),
                            // cssOnly,
                            vue(),
                            vueJsx,
                            esbuild(),
                            filesize
                        ],
                        external: [...externals, ...external]
                    }
                    // const writeOptions = bundleConfig.map(
                    //     ({ name, format, globals, bundlePath }): OutputOptions => ({
                    //         format,
                    //         file: resolve(
                    //             OUTPUT_BUNDLE,
                    //             `index.full.${format === 'umd' ? 'js' : 'mjs'}`
                    //         ),
                    //         exports: format === 'umd' ? 'named' : 'auto',
                    //         name,
                    //         globals,
                    //         paths: pathRewriter(bundlePath),
                    //         banner: config.banner,
                    //         plugins: [filesize]
                    //     })
                    // )
                    const bundle = await rollup(rollupConfig)
                    await Promise.all(
                        writeOptions.map(option => bundle.write(option))
                    )

                    // create library options
                    // options.push({
                    //     input,
                    //     output,
                    //     plugins: [
                    //         nodeResolve,
                    //         target ? esbuild({ target }) : esbuild(),
                    //         filesize
                    //     ],
                    //     external: [...externals, ...external]
                    //     // external(id) {
                    //     //     return (
                    //     //         ['regenerator-runtime', ...externals, ...external].some(k =>
                    //     //             new RegExp('^' + k).test(id)
                    //     //         ) || deps.some(k => new RegExp('^' + k).test(id))
                    //     //     )
                    //     // }
                    // })

                    // create dts options
                    // if (dts !== false) {
                    //     options.push({
                    //         input,
                    //         output: {
                    //             file: `packages/${name}/dist/${fn}.d.ts`,
                    //             format: 'es'
                    //         },
                    //         plugins: [dtsPlugin],
                    //         external: [...externals, ...external]
                    //     })
                    // }
                }
            }
        )

    await Promise.all(builds)

    // const input = resolve(ROOT, 'packages/index.ts')
    // const rollupConfig = {
    //     input,
    //     plugins: [
    //         alias({
    //             entries: [
    //                 {
    //                     find: /^@\//,
    //                     replacement: ROOT + '/packages/'
    //                 }
    //             ],
    //             customResolver: nodeResolve() as ResolverObject
    //         }),
    //         json,
    //         commonjs,
    //         nodeResolve(),
    //         cssOnly,
    //         vue(),
    //         vueJsx,
    //         esbuild()
    //     ],
    //     external
    // }
    // const writeOptions = bundleConfig.map(
    //     ({ name, format, globals, bundlePath }): OutputOptions => ({
    //         format,
    //         file: resolve(
    //             OUTPUT_BUNDLE,
    //             `index.full.${format === 'umd' ? 'js' : 'mjs'}`
    //         ),
    //         exports: format === 'umd' ? 'named' : 'auto',
    //         name,
    //         globals,
    //         paths: pathRewriter(bundlePath),
    //         banner: config.banner,
    //         plugins: [filesize]
    //     })
    // )
    // const bundle = await rollup(rollupConfig)
    // await Promise.all(writeOptions.map(option => bundle.write(option)))
}

export async function genVersion() {
    await run(`pnpm gen:version`)
}

export default series(
    // wrapDisplayName('gen:version', genVersion),
    parallel(wrapDisplayName('build:full:bundle', buildCjs))
)

// export async function buildCjs() {
//     console.log(100)
//     // await run(`npx tsc -b --force ${join(ROOT, 'tsconfig.cjs.json')}`)
// }

// export async function cleanCjs() {
//     console.log(101)
//     // const dirs: string[] = [OUTPUT_CJS]
//     // await run(`rimraf ${dirs.join(' ')}`)
//     // await run(`mkdir -p ${dirs.join(' ')}`)
// }

// export default series(
//     wrapDisplayName('clean:cjs', cleanCjs),
//     parallel(wrapDisplayName('build:cjs:bundle', buildCjs))
// )
