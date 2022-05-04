// import { parallel, series } from 'gulp'
// import { wrapDisplayName } from '../utils/gulp'
// import { run } from '../utils/exec'
// import { OUTPUT_CJS, PACKAGE } from '../utils/paths';

import { resolve } from 'path'
import { parallel, series } from 'gulp'
import { rollup } from 'rollup'
import alias from '@rollup/plugin-alias'
import type { OutputOptions } from 'rollup'
import type { ResolverObject } from '@rollup/plugin-alias'
import glob from 'fast-glob'
import { wrapDisplayName } from '../utils/gulp'
import {
    banner as bannerPlugin,
    commonjs,
    dts as dtsPlugin,
    esbuild,
    filesize,
    json,
    minify,
    nodeExternals,
    nodeResolve,
    shebang
    // visual,
} from '../plugins/index'
import { run } from '../utils/exec'
// import { external, pathRewriter } from '../utils/rollup'
// import { bundleConfig } from '../buildConfig'
// import config from '../config'
import { PACKAGE, ROOT } from '../utils/paths'
import { packages } from '../packages'

export async function buildCjs() {
    const externals = [
        /node_modules/,
        'js-cool',
        '@gitmars/core',
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
                const pkg = require(resolve(PACKAGE, name, 'package.json'))
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
                const iifeName = 'Gitmars'
                const fileList = glob.sync('**/*.ts', {
                    cwd: resolve(PACKAGE, name, 'src'),
                    ignore: ['node_modules']
                })

                // submodules
                // if (submodules) {
                //     functionNames.push(
                //         ...glob
                //             .sync('*/index.ts', {
                //                 cwd: resolve(`packages/${name}`)
                //             })
                //             .map(i => i.split('/')[0])
                //     )
                // }
                for (const fn of fileList) {
                    const input = resolve(PACKAGE, name, 'src', fn)

                    const writeOptions: OutputOptions[] = []
                    // output mjs
                    if (mjs !== false) {
                        writeOptions.push({
                            file: resolve(
                                PACKAGE,
                                name,
                                'es',
                                fn.replace(/\.ts$/, '.mjs')
                            ),
                            // exports: 'auto',
                            exports: exportType,
                            banner,
                            format: 'es'
                        })
                    }
                    // output cjs
                    if (cjs !== false) {
                        writeOptions.push({
                            file: resolve(
                                PACKAGE,
                                name,
                                'lib',
                                fn.replace(/\.ts$/, '.js')
                            ),
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
                                file: resolve(
                                    PACKAGE,
                                    name,
                                    'dist',
                                    fn.replace(/\.ts$/, 'iife.js')
                                ),
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
                                file: resolve(
                                    PACKAGE,
                                    name,
                                    'dist',
                                    fn.replace(/\.ts$/, 'iife.min.js')
                                ),
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
                                        replacement: resolve(PACKAGE, name, 'src')
                                    }
                                ],
                                customResolver: nodeResolve() as ResolverObject
                            }),
                            shebang(),
                            json,
                            commonjs,
                            nodeResolve(),
                            esbuild(),
                            // target ? esbuild({ target }) : esbuild(),
                            filesize
                        ],
                        external: [...externals, ...external]
                    }
                    const bundle = await rollup(rollupConfig)
                    await Promise.all(
                        writeOptions.map(option => bundle.write(option))
                    )

                    // dts
                    if (dts !== false) {
                        const rollupDtsConfig = {
                            input,
                            plugins: [nodeExternals(), dtsPlugin],
                            external: [...externals, ...external]
                        }
                        const writeEsmDtsOptions: OutputOptions[] = [
                            {
                                file: resolve(
                                    PACKAGE,
                                    name,
                                    'es',
                                    fn.replace(/\.ts$/, '.d.ts')
                                ),
                                // exports: 'auto',
                                // exports: exportType,
                                // banner,
                                format: 'es'
                            }
                        ]
                        const writeCjsDtsOptions: OutputOptions[] = [
                            {
                                file: resolve(
                                    PACKAGE,
                                    name,
                                    'lib',
                                    fn.replace(/\.ts$/, '.d.ts')
                                ),
                                // exports: 'auto',
                                // exports: exportType,
                                // banner,
                                format: 'es'
                            }
                        ]
                        const dtsBundle = await rollup(rollupDtsConfig)
                        await Promise.all([
                            writeEsmDtsOptions.map(option =>
                                dtsBundle.write(option)
                            ),
                            writeCjsDtsOptions.map(option =>
                                dtsBundle.write(option)
                            )
                        ])
                    }
                }
            }
        )
    await Promise.all(builds)
}

export async function genVersion() {
    await run(`pnpm gen:version`)
}

export default series(
    // wrapDisplayName('gen:version', genVersion),
    parallel(wrapDisplayName('build:cjs', buildCjs))
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
