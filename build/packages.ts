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
        display: 'gitmars可视化界面'
    },
    {
        name: 'server',
        pkgName: '@gitmars/server',
        iife: false,
        mjs: false,
        dts: false,
        display: 'gitmars可视化界面服务端'
    },
    {
        name: 'docs',
        pkgName: '@gitmars/docs',
        iife: false,
        mjs: false,
        dts: false,
        display: 'gitmars文档库'
    }
]
