import type * as tasks from './gulpfile'

export interface PackageManifest {
    name: string
    pkgName: string
    display: string
    buildTask: Exclude<keyof typeof tasks, 'default'>
    addon?: boolean
    author?: string
    description?: string
    external?: string[]
    globals?: Record<string, string>
    manualImport?: boolean
    deprecated?: boolean
    submodules?: boolean
    build?: boolean
    iife?: boolean
    cjs?: boolean
    mjs?: boolean
    dts?: boolean
    output?: 'dist' | 'lib' | 'app' | 'es'
    exportType?: 'auto' | 'default' | 'named' | 'none'
}
