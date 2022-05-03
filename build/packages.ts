import type { PackageManifest } from './types'

export const packages: PackageManifest[] = [
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
        name: 'core',
        pkgName: '@gitmars/core',
        buildTask: 'cjs',
        iife: false,
        cjs: true,
        mjs: true,
        dts: true,
        output: 'lib',
        exportType: 'named',
        display: 'gitmars核心程序'
    }
    // {
    //     name: 'ui',
    //     pkgName: '@gitmars/ui',
    //     buildTask: 'cjs',
    //     iife: false,
    //     mjs: false,
    //     dts: false,
    //     submodules: true,
    // output: 'dist',
    //     display: 'gitmars可视化界面'
    // },
    // {
    //     name: 'server',
    //     pkgName: '@gitmars/server',
    //     buildTask: 'cjs',
    //     iife: false,
    //     mjs: false,
    //     dts: false,
    // output: 'app',
    //     display: 'gitmars可视化界面服务端'
    // },
    // {
    //     name: 'docs',
    //     pkgName: '@gitmars/docs',
    //     buildTask: 'docs',
    //     iife: false,
    //     mjs: false,
    //     dts: false,
    // output: 'dist',
    //     display: 'gitmars文档库'
    // }
]
