import _replace, { type RollupReplaceOptions } from '@rollup/plugin-replace'
import type { Plugin } from 'rollup'
import { version } from '../config'

const replace = (options: RollupReplaceOptions = {}): Plugin =>
	_replace(
		Object.assign(
			{
				preventAssignment: true,
				__VERSION__: version
			},
			options
		)
	)

export default replace
