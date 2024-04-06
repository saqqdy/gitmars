import _terser, { type Options } from '@rollup/plugin-terser'
import type { Plugin } from 'rollup'

const terser = (options: Options = {}): Plugin =>
	_terser(
		Object.assign(
			{
				// format: {
				// 	comments: false
				// }
			},
			options
		)
	)

export default terser
