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
        pkgName: 'ui',
        iife: false,
        mjs: false,
        dts: false,
        submodules: true,
        display: 'Eslint config basic sets'
    },
    {
        name: 'server',
        pkgName: 'server',
        iife: false,
        mjs: false,
        dts: false,
        display: 'Eslint config basic sets for typescript'
    },
    {
        name: 'docs',
        pkgName: 'docs',
        iife: false,
        mjs: false,
        dts: false,
        display: 'Eslint config basic sets for typescript'
    }
]
