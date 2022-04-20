import { terser as _terser } from 'rollup-plugin-terser'
import type { Plugin } from 'rollup'

const terser: Plugin = _terser({
    format: {
        comments: false
    },
    compress: false
})

export default terser
