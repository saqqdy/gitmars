import vue, { type Options } from '@vitejs/plugin-vue'
import type { Plugin } from 'rollup'

export default (options: Options = {}): Plugin =>
	vue(Object.assign({ isProduction: true }, options))
