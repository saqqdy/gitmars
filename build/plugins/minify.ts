import esbuild from 'rollup-plugin-esbuild'
import type { Plugin } from 'rollup'
import type { Options as ESBuildOptions } from 'rollup-plugin-esbuild'

export default (options: ESBuildOptions): Plugin => {
	const { renderChunk } = esbuild(options)
	return {
		name: 'esbuild-minify',
		renderChunk
	}
}
