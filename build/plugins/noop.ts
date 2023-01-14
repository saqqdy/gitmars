import type { Plugin } from 'rollup'

function noop() {
	return {
		name: 'noop',
		renderChunk(code: string) {
			return { code }
		}
	}
}

export default noop() as Plugin
