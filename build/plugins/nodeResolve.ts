import type { RollupNodeResolveOptions } from '@rollup/plugin-node-resolve'
import { nodeResolve as resolve } from '@rollup/plugin-node-resolve'
import type { Plugin } from 'rollup'

export default (options: RollupNodeResolveOptions = {}): Plugin =>
    resolve(
        Object.assign(
            {
                extensions: [
                    '.mjs',
                    '.js',
                    '.jsx',
                    '.ts',
                    '.tsx',
                    '.es6',
                    '.es',
                    '.json',
                    '.less',
                    '.css'
                ],
                preferBuiltins: true
            },
            options
        )
    )
