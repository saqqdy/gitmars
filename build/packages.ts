import type { PackageManifest } from './types'

export const packages: PackageManifest[] = [
    {
        name: 'core',
        pkgName: '@gitmars/core',
        buildTask: 'cjs',
        iife: false,
        cjs: true,
        mjs: true,
        dts: true,
        output: 'lib',
        display: 'gitmars核心程序'
    },
    {
        name: 'gitmars',
        pkgName: 'gitmars',
        buildTask: 'cjs',
        iife: false,
        cjs: true,
        mjs: false,
        dts: false,
        output: 'lib',
        display: '这是一个git工作流工具'
    },
    {
        name: 'server',
        pkgName: '@gitmars/server',
        buildTask: 'cjs',
        iife: false,
        mjs: false,
        dts: false,
        output: 'lib',
        display: 'gitmars可视化界面服务端'
    },
    {
        name: 'ui',
        pkgName: '@gitmars/ui',
        buildTask: 'app',
        iife: false,
        mjs: false,
        dts: false,
        submodules: false,
        output: 'dist',
        display: 'gitmars可视化界面'
    },
    {
        name: 'docs',
        pkgName: '@gitmars/docs',
        buildTask: 'docs',
        iife: false,
        mjs: false,
        dts: false,
        output: 'dist',
        display: 'gitmars文档库'
    }
]
