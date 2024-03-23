import type { PackageManifest } from './types'

export const packages: PackageManifest[] = [
	{
		name: 'core',
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
		name: 'core',
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
		name: 'core',
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
		name: 'core',
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
		name: 'core',
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
		name: 'core',
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
