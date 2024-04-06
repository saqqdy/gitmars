import _banner, { type Options } from 'rollup-plugin-add-banner'
import type { Plugin } from 'rollup'
import { banner as content } from '../config'

const banner = (options: Options): Plugin =>
	_banner(
		Object.assign(
			{
				content
			},
			options
		)
	)

export default banner
