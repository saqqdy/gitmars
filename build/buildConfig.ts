import type { ModuleFormat } from 'rollup'
import {
    OUTPUT_BUNDLE_PATH,
    OUTPUT_CJS_PATH,
    OUTPUT_ESM_PATH
} from './utils/paths'

export interface BuildConfig {
    format: ModuleFormat
    name?: string
    output: {
        name: string
        path: string
    }
    globals?: Record<string, string>
    bundlePath: string
}

export const buildConfig: BuildConfig[] = [
    {
        format: 'esm',
        output: {
            name: 'es',
            path: OUTPUT_ESM_PATH
        },
        bundlePath: 'kdesign-vue/es'
    },
    {
        format: 'cjs',
        output: {
            name: 'lib',
            path: OUTPUT_CJS_PATH
        },
        bundlePath: 'kdesign-vue/lib'
    }
]

export const bundleConfig: BuildConfig[] = [
    {
        name: 'KDesign',
        format: 'es',
        output: {
            name: 'dist',
            path: OUTPUT_BUNDLE_PATH
        },
        globals: {
            vue: 'Vue',
            'kdesign-vue': 'KDesignVue'
        },
        bundlePath: 'kdesign-vue/dist'
    },
    {
        name: 'KDesign',
        format: 'umd',
        output: {
            name: 'dist',
            path: OUTPUT_BUNDLE_PATH
        },
        globals: {
            vue: 'Vue',
            'kdesign-vue': 'KDesignVue'
        },
        bundlePath: 'kdesign-vue/dist'
    }
]
