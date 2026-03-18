import type { Plugin } from 'rollup'
import _banner, { type Options } from 'rollup-plugin-add-banner'
import { banner as content } from '../config'

const banner = (options: Options): Plugin =>
	_banner(
		Object.assign(
			{
				content,
			},
			options,
		),
	)

export default banner
