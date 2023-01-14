import shebang, { type Options } from 'rollup-plugin-replace-shebang'
import type { Plugin } from 'rollup'

export default (options: Partial<Options> = {}): Plugin =>
	shebang(
		Object.assign(
			{
				shebang: '#!/usr/bin/env node',
				skipBackslash: true // 跳过\u005c 反斜杠
			},
			options
		)
	)
