export interface PackageManifest {
    name: string
    pkgName: string
    display: string
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
    target?: string
    exportType?: 'auto' | 'default' | 'named' | 'none'
}
