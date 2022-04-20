import { default as _esbuild } from 'rollup-plugin-esbuild'
import type { Plugin } from 'rollup'
import type { Options as ESBuildOptions } from 'rollup-plugin-esbuild'

const minify = (options: ESBuildOptions): Plugin => {
    const { renderChunk } = _esbuild(options)
    return {
        name: 'esbuild-minify',
        renderChunk
    }
}

export default minify
