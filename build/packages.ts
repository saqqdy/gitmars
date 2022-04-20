import type { PackageManifest } from './types'

export const packages: PackageManifest[] = [
    {
        name: 'gitmars',
        pkgName: 'gitmars',
        iife: false,
        mjs: true,
        submodules: true,
        display: '这是一个git工作流工具'
    },
    {
        name: 'ui',
        pkgName: '@gitmars/ui',
        iife: false,
        mjs: false,
        dts: false,
        submodules: true,
        display: 'Eslint config basic sets'
    },
    {
        name: 'server',
        pkgName: '@gitmars/server',
        iife: false,
        mjs: false,
        dts: false,
        display: 'Eslint config basic sets for typescript'
    },
    {
        name: 'docs',
        pkgName: '@gitmars/docs',
        iife: false,
        mjs: false,
        dts: false,
        display: 'Eslint config basic sets for typescript'
    }
]
