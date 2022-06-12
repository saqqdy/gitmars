import type { Plugin } from 'rollup'

function noop() {
    return {
        name: 'noop'
    }
}

export default noop() as Plugin
