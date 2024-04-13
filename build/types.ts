import type * as tasks from './gulpfile'

type WithArray<T> = T | T[]

export type Name =
	| 'utils'
	| 'git'
	| 'hook'
	| 'cache'
	| 'go'
	| 'api'
	| 'build'
	| 'core'
	| 'gitmars'
	| 'docs'
	| 'monorepo'

export type PkgName =
	| '@gitmars/utils'
	| '@gitmars/git'
	| '@gitmars/hook'
	| '@gitmars/cache'
	| '@gitmars/go'
	| '@gitmars/api'
	| '@gitmars/build'
	| '@gitmars/core'
	| 'gitmars'
	| '@gitmars/docs'
	| '@gitmars/monorepo'

export type Task = Exclude<keyof typeof tasks, 'default'> | 'bundle'
export type BuildTask = WithArray<Task>

export interface PackageManifest {
	name: Name
	pkgName: PkgName
	display: string
	buildTask: BuildTask
	addon?: boolean
	author?: string
	description?: string
	external?: string[]
	externalUmd?: string[]
	globals?: Record<string, string>
	manualImport?: boolean
	deprecated?: boolean
	build?: boolean
	iife?: boolean
	iifeName?: string
	cjs?: boolean
	mjs?: boolean
	browser?: boolean
	bundler?: boolean
	types?: boolean
	output?: 'dist' | 'lib' | 'app' | 'es'
	extractTypes?: boolean
	// target?: string // esbuild target
}
