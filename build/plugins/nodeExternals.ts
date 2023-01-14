import { type ExternalsOptions, externals } from 'rollup-plugin-node-externals'
import type { Plugin } from 'rollup'

export default (options: ExternalsOptions = {}): Plugin =>
	externals(
		Object.assign(
			{
				exclude: []
			},
			options
		)
	)
