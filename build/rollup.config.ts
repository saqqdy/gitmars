import { resolve } from 'path'
import fg from 'fast-glob'
import type { OutputOptions, RollupOptions } from 'rollup'
import { packages } from './packages'
import {
    banner as bannerPlugin,
    dts as dtsPlugin,
    esbuild,
    filesize,
    minify,
    nodeResolve
} from './plugins'

// const production = !process.env.ROLLUP_WATCH

const options: RollupOptions[] = []
const externals = ['js-cool', '@gitmars/docs', '@gitmars/server', '@gitmars/ui']

for (const {
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
} of packages) {
    if (build === false) continue
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
    if (submodules)
        functionNames.push(
            ...fg
                .sync('*/index.ts', { cwd: resolve(`packages/${name}`) })
                .map(i => i.split('/')[0])
        )

    for (const fn of functionNames) {
        const input =
            fn === 'index'
                ? `packages/${name}/index.ts`
                : `packages/${name}/${fn}/index.ts`
        const output: OutputOptions[] = []
        // output mjs
        if (mjs !== false) {
            output.push({
                file: `packages/${name}/dist/${fn}.mjs`,
                // exports: 'auto',
                exports: exportType,
                banner,
                format: 'es'
            })
        }
        // output cjs
        if (cjs !== false) {
            output.push({
                file: `packages/${name}/dist/${fn}.js`,
                // exports: 'auto',
                exports: exportType,
                banner,
                format: 'cjs'
            })
        }
        // output iife
        if (iife !== false) {
            output.push(
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
                        bannerPlugin({
                            content: banner
                        })
                    ]
                }
            )
        }

        // create library options
        options.push({
            input,
            output,
            plugins: [
                nodeResolve,
                target ? esbuild({ target }) : esbuild(),
                filesize
            ],
            external: [...externals, ...external]
            // external(id) {
            //     return (
            //         ['regenerator-runtime', ...externals, ...external].some(k =>
            //             new RegExp('^' + k).test(id)
            //         ) || deps.some(k => new RegExp('^' + k).test(id))
            //     )
            // }
        })

        // create dts options
        if (dts !== false) {
            options.push({
                input,
                output: {
                    file: `packages/${name}/dist/${fn}.d.ts`,
                    format: 'es'
                },
                plugins: [dtsPlugin],
                external: [...externals, ...external]
            })
        }
    }
}

export default options
