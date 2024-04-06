import type { PackageManifest } from './types'

export const packages: PackageManifest[] = [
	{
		name: 'utils',
		pkgName: '@gitmars/utils',
		buildTask: ['type', 'lib'],
		external: [],
		iife: false,
		browser: false,
		output: 'lib',
		display: 'gitmars utils'
	},
	{
		name: 'git',
		pkgName: '@gitmars/git',
		buildTask: ['type', 'lib'],
		iife: false,
		browser: false,
		output: 'lib',
		display: 'gitmars git'
	},
	{
		name: 'hook',
		pkgName: '@gitmars/hook',
		buildTask: ['type', 'lib'],
		iife: false,
		browser: false,
		output: 'lib',
		display: 'gitmars hook'
	},
	{
		name: 'cache',
		pkgName: '@gitmars/cache',
		buildTask: ['type', 'lib'],
		iife: false,
		browser: false,
		output: 'lib',
		display: 'gitmars cache'
	},
	{
		name: 'go',
		pkgName: '@gitmars/go',
		buildTask: ['type', 'lib'],
		iife: false,
		browser: false,
		output: 'lib',
		display: 'gitmars go'
	},
	{
		name: 'api',
		pkgName: '@gitmars/api',
		buildTask: ['type', 'lib'],
		iife: false,
		browser: false,
		output: 'lib',
		display: 'gitmars api'
	},
	{
		name: 'build',
		pkgName: '@gitmars/build',
		buildTask: ['type', 'lib'],
		iife: false,
		browser: false,
		output: 'lib',
		display: 'gitmars build'
	},
	{
		name: 'core',
		pkgName: '@gitmars/core',
		buildTask: ['type', 'lib'],
		iife: false,
		browser: false,
		output: 'lib',
		display: 'gitmars核心程序'
	},
	{
		name: 'gitmars',
		pkgName: 'gitmars',
		buildTask: ['type', 'lib'],
		iife: false,
		browser: false,
		output: 'lib',
		display: '这是一个git工作流工具'
	},
	{
		name: 'docs',
		pkgName: '@gitmars/docs',
		buildTask: 'docs',
		iife: false,
		browser: false,
		output: 'dist',
		display: 'gitmars文档库'
	}
]

export const packageNames = packages.map(({ pkgName }) => pkgName)

export function getPackages(name?: string | string[]) {
	if (!name) return packages

	const list = packages.filter(item => ([] as string[]).concat(name).includes(item.name))
	if (list.length === 0) {
		console.info(`no package founded`)
		return packages
	}

	return list
}
