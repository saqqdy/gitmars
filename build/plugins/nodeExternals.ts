import externals, { type ExternalsOptions } from 'rollup-plugin-node-externals'
import type { Plugin } from 'rollup'

export default (options: ExternalsOptions = {}): Plugin =>
    externals(
        Object.assign(
            {
                exclude: []
            },
            options
        )
    )
