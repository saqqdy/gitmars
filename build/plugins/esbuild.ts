import esbuild, { type Options } from 'rollup-plugin-esbuild'
import type { Plugin } from 'rollup'

export default (options: Options = {}): Plugin =>
    esbuild({
        minify: false, // 避免\u005c被转码
        sourceMap: options.minify || false,
        target: 'es2020',
        loaders: {
            '.vue': 'ts'
        },
        define: {
            'process.env.NODE_ENV': JSON.stringify('production')
        },
        ...options
    })
