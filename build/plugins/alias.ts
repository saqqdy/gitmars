import type { RollupAliasOptions } from '@rollup/plugin-alias'
import type { Plugin } from 'rollup'
import alias from '@rollup/plugin-alias'
import { nodeResolve as resolve } from '@rollup/plugin-node-resolve'

export default (options: RollupAliasOptions = {}): Plugin =>
	alias(
		Object.assign(
			{
				// entries: [],
				customResolver: resolve({
					extensions: [
						'.js',
						'.mjs',
						'.cjs',
						'.jsx',
						'.ts',
						'.mts',
						'.cts',
						'.tsx',
						'.es6',
						'.es',
						'.json',
						'.less',
						'.css',
					],
					preferBuiltins: true,
					exportConditions: ['node'],
				}),
			},
			options,
		),
	)
