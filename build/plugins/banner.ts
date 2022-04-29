import banner, { type Options } from 'rollup-plugin-add-banner'
import type { Plugin } from 'rollup'
import { banner as content } from '../config'

export default (options: Partial<Options> = {}): Plugin =>
	banner(
		Object.assign(
			{
				content
			},
			options
		)
	)
