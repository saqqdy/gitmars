import { resolve } from 'path'
import { parallel, series } from 'gulp'
import { rollup } from 'rollup'
import alias from '@rollup/plugin-alias'
import type { OutputOptions } from 'rollup'
import type { ResolverObject } from '@rollup/plugin-alias'
import glob from 'fast-glob'
import { runExec, runSpawnSync } from '../utils/exec'
import { wrapDisplayName } from '../utils/gulp'
import { excludeFiles, generateExternal } from '../utils/rollup'

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
import { PACKAGE } from '../utils/paths'
import { packages } from '../packages'

const pkgs = packages.filter(({ buildTask }) => buildTask === 'cjs')

export async function buildCjs() {
    const externals = [
        'js-cool',
        '@gitmars/core',
        '@gitmars/docs',
        '@gitmars/server',
        '@gitmars/ui'
    ]
    const builds = pkgs.map(
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
            const fileList = excludeFiles(
                glob.sync('**/*.ts', {
                    cwd: resolve(PACKAGE, name, 'src'),
                    ignore: ['node_modules'],
                    // absolute: true,
                    onlyFiles: true
                })
            )

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
                        nodeResolve(),
                        json,
                        commonjs,
                        shebang(),
                        esbuild(),
                        // target ? esbuild({ target }) : esbuild(),
                        filesize
                    ],
                    external: generateExternal({ name, input }, [
                        ...externals,
                        ...external
                    ])
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

export async function madgeLib() {
    for (const { name, output = 'lib' } of pkgs) {
        await runExec(`npx madge ${output}/ -c`, resolve(PACKAGE, name))
    }
}

export async function copyFile() {
    for (const { name } of pkgs) {
        await runExec(
            `rsync -av --exclude="*.ts" ${resolve(
                PACKAGE,
                name,
                'src'
            )}/ ${resolve(PACKAGE, name, 'lib')}/`
        )
    }
}

export async function cleanDirs() {
    for (const { name } of pkgs) {
        await runSpawnSync(`rimraf lib es dist`, resolve(PACKAGE, name))
    }
}

export async function genVersion() {
    await runSpawnSync(`pnpm gen:version`)
}

export default series(
    wrapDisplayName('clean:dirs', cleanDirs),
    // wrapDisplayName('gen:version', genVersion),
    parallel(wrapDisplayName('build:cjs', buildCjs)),
    parallel(wrapDisplayName('madge:lib', madgeLib)),
    parallel(wrapDisplayName('copy:json,sh', copyFile))
)
