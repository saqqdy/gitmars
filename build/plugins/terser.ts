import type { Plugin } from 'rollup'
import _terser, { type Options } from '@rollup/plugin-terser'

const terser = (options: Options = {}): Plugin =>
	_terser(
		Object.assign(
			{
				// format: {
				// 	comments: false
				// }
			},
			options,
		),
	)

export default terser
