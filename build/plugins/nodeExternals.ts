import { type ExternalsOptions, nodeExternals } from 'rollup-plugin-node-externals'
import type { Plugin } from 'rollup'

export default (options: ExternalsOptions = {}): Plugin =>
	nodeExternals(
		Object.assign(
			{
				exclude: []
			},
			options
		)
	)
