import { readFileSync } from 'fs'
import type { Plugin } from 'rollup'

const injectEslintSetsCore: Plugin = {
    name: 'inject-eslint-sets-core',
    renderChunk(code) {
        const ESLINT_SETS_CORE_IIFE = readFileSync(
            require.resolve('@eslint-sets/core/lib/index.iife.js'),
            'utf-8'
        )
        return `${ESLINT_SETS_CORE_IIFE};\n;${code}`
    }
}

export default injectEslintSetsCore
