import type { PackageManifest } from './types'

export const packages: PackageManifest[] = [
	{
		name: 'utils',
		pkgName: '@gitmars/utils',
		buildTask: ['type', 'lib'],
		iife: false,
		cjs: true,
		mjs: true,
		dts: false,
		output: 'lib',
		display: 'gitmars utils'
	},
	{
		name: 'git',
		pkgName: '@gitmars/git',
		buildTask: ['type', 'lib'],
		iife: false,
		cjs: true,
		mjs: true,
		dts: false,
		output: 'lib',
		display: 'gitmars git'
	},
	{
		name: 'hook',
		pkgName: '@gitmars/hook',
		buildTask: ['type', 'lib'],
		iife: false,
		cjs: true,
		mjs: true,
		dts: false,
		output: 'lib',
		display: 'gitmars hook'
	},
	{
		name: 'cache',
		pkgName: '@gitmars/cache',
		buildTask: ['type', 'lib'],
		iife: false,
		cjs: true,
		mjs: true,
		dts: false,
		output: 'lib',
		display: 'gitmars cache'
	},
	{
		name: 'go',
		pkgName: '@gitmars/go',
		buildTask: ['type', 'lib'],
		iife: false,
		cjs: true,
		mjs: true,
		dts: false,
		output: 'lib',
		display: 'gitmars go'
	},
	{
		name: 'api',
		pkgName: '@gitmars/api',
		buildTask: ['type', 'lib'],
		iife: false,
		cjs: true,
		mjs: true,
		dts: false,
		output: 'lib',
		display: 'gitmars api'
	},
	{
		name: 'build',
		pkgName: '@gitmars/build',
		buildTask: ['type', 'lib'],
		iife: false,
		cjs: true,
		mjs: true,
		dts: false,
		output: 'lib',
		display: 'gitmars build'
	},
	{
		name: 'core',
		pkgName: '@gitmars/core',
		buildTask: ['type', 'lib'],
		iife: false,
		cjs: true,
		mjs: true,
		dts: false,
		output: 'lib',
		display: 'gitmars核心程序'
	},
	{
		name: 'gitmars',
		pkgName: 'gitmars',
		buildTask: ['type', 'lib'],
		iife: false,
		cjs: false,
		mjs: true,
		dts: false,
		output: 'lib',
		display: '这是一个git工作流工具'
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
