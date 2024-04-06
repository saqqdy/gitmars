import _babel, { type RollupBabelInputPluginOptions } from '@rollup/plugin-babel'
import type { Plugin } from 'rollup'
import { extensions } from '../config'

const babel = (options: RollupBabelInputPluginOptions = {}): Plugin =>
	_babel(
		Object.assign(
			{
				babelHelpers: 'bundled',
				extensions,
				exclude: [/node_modules[\\/]core-js/]
			},
			options
		)
	)

export default babel
