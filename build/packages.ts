import { intersect } from 'js-cool'
import type { Name, PackageManifest, Task } from './types'

export const packages: PackageManifest[] = [
	{
		name: 'utils',
		pkgName: '@gitmars/utils',
		buildTask: 'bundle',
		external: [],
		iife: false,
		browser: false,
		display: 'gitmars utils'
	},
	{
		name: 'git',
		pkgName: '@gitmars/git',
		buildTask: 'bundle',
		iife: false,
		browser: false,
		display: 'gitmars git'
	},
	{
		name: 'hook',
		pkgName: '@gitmars/hook',
		buildTask: 'bundle',
		iife: false,
		browser: false,
		display: 'gitmars hook'
	},
	{
		name: 'cache',
		pkgName: '@gitmars/cache',
		buildTask: 'bundle',
		iife: false,
		browser: false,
		display: 'gitmars cache'
	},
	{
		name: 'go',
		pkgName: '@gitmars/go',
		buildTask: 'bundle',
		iife: false,
		browser: false,
		display: 'gitmars go'
	},
	{
		name: 'build',
		pkgName: '@gitmars/build',
		buildTask: 'bundle',
		iife: false,
		browser: false,
		display: 'gitmars build'
	},
	{
		name: 'api',
		pkgName: '@gitmars/api',
		buildTask: 'bundle',
		iife: false,
		browser: false,
		display: 'gitmars api'
	},
	{
		name: 'core',
		pkgName: '@gitmars/core',
		buildTask: 'bundle',
		iife: false,
		browser: false,
		display: 'gitmars核心程序'
	},
	{
		name: 'gitmars',
		pkgName: 'gitmars',
		buildTask: 'lib',
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
		display: 'gitmars文档库'
	},
	{
		name: 'monorepo',
		pkgName: '@gitmars/monorepo',
		build: false,
		display: 'gitmars monorepo'
	}
]

export const names = packages.map(({ name }) => name)
export const packageNames = packages.map(({ pkgName }) => pkgName)
export const buildTasks = packages.reduce((acc, cur) => {
	if (cur.buildTask)
		for (const item of ([] as Task[]).concat(cur.buildTask)) {
			!acc.includes(item) && acc.push(item)
		}
	return acc
}, [] as Task[])

/**
 * get package sets
 */
export function getPackages(name?: Name | Name[]): PackageManifest[]
export function getPackages(name?: Task | Task[]): PackageManifest[]
export function getPackages(name?: string | string[]) {
	if (!name) return packages
	if (typeof name === 'string') name = ([] as string[]).concat(name)

	const list = packages.filter(item => {
		if (intersect(buildTasks, name).length) {
			// 传入task
			return (
				item.buildTask &&
				intersect(
					typeof item.buildTask === 'string'
						? ([] as Task[]).concat(item.buildTask)
						: item.buildTask,
					name
				).length
			)
		}
		// 传入name
		return name.includes(item.name)
	})
	if (list.length === 0) {
		console.info(`no package founded`)
		return packages
	}

	return list
}

export function getLibPackages(name?: string | string[]) {
	const _names = typeof name === 'string' ? ([] as string[]).concat(name) : name
	const list = packages.filter(item => {
		const _buildTask =
			item.buildTask && typeof item.buildTask === 'string'
				? [item.buildTask]
				: item.buildTask || []

		if (!_names) return _buildTask.includes('lib')
		return _buildTask.includes('lib') && _names.includes(item.name)
	})
	if (list.length === 0) {
		console.info(`no package founded`)
		return packages
	}

	return list
}

export function getBundlePackages(name?: string | string[]) {
	const _names = typeof name === 'string' ? ([] as string[]).concat(name) : name
	const list = packages.filter(item => {
		const _buildTask =
			item.buildTask && typeof item.buildTask === 'string'
				? [item.buildTask]
				: item.buildTask || []

		if (!_names) return _buildTask.includes('bundle')
		return _buildTask.includes('bundle') && _names.includes(item.name)
	})
	if (list.length === 0) {
		console.info(`no package founded`)
		return packages
	}

	return list
}
