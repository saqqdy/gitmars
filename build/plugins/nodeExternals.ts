import type { Plugin } from 'rollup'
import {
	type ExternalsOptions,
	nodeExternals,
} from 'rollup-plugin-node-externals'

export default (options: ExternalsOptions = {}): Plugin =>
	nodeExternals(
		Object.assign(
			{
				exclude: [],
			},
			options,
		),
	)
