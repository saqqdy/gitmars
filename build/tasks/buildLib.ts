import { extname, resolve } from 'path'
import { parallel, series } from 'gulp'
import { rollup } from 'rollup'
import type { OutputOptions } from 'rollup'
import glob from 'fast-glob'
import { runExec, runSpawnSync } from '../utils/exec'
import { wrapDisplayName } from '../utils/gulp'
import { excludeFiles, generateExternal } from '../utils/rollup'
import { version } from '../config'

import {
	// alias,
	// banner as bannerPlugin,
	commonjs,
	esbuild,
	filesize,
	json,
	// minify,
	// nodeExternals,
	nodeResolve,
	replace,
	shebang
	// visual,
} from '../plugins/index'
import { PACKAGE } from '../utils/paths'
import { getLibPackages } from '../packages'

let pkgs = getLibPackages()
const childBuildLibIndex = process.argv.indexOf('lib')

if (childBuildLibIndex > -1) {
	const [, packageKey, packageName] = process.argv.slice(childBuildLibIndex)
	if (packageKey === '--package' && packageName)
		pkgs = pkgs.filter(({ name }) => packageName.split(',').includes(name))
}

export async function buildLib() {
	const externals = [
		'js-cool',
		'@gitmars/api',
		'@gitmars/build',
		'@gitmars/cache',
		'@gitmars/core',
		'@gitmars/git',
		'@gitmars/go',
		'@gitmars/hook',
		'@gitmars/utils',
		'@gitmars/docs'
	]
	const builds = pkgs.map(
		async ({ globals = {}, name, external = [], iife, build, cjs, mjs, output = 'dist' }) => {
			if (build === false) return
			const pkg = require(resolve(PACKAGE, name, 'package.json'))
			const banner =
				'/*!\n' +
				' * ' +
				pkg.name +
				' v' +
				pkg.version +
				'\n' +
				' * ' +
				pkg.description +
				'\n' +
				' * (c) 2021-' +
				new Date().getFullYear() +
				' saqqdy<https://github.com/saqqdy> \n' +
				' * Released under the MIT License.\n' +
				' */'
			// const iifeGlobals = {
			// 	'js-cool': 'JsCool',
			// 	...globals
			// }
			// const iifeName = 'Gitmars'
			const fileList = excludeFiles(
				glob.sync('**/*.ts', {
					cwd: resolve(PACKAGE, name, 'src'),
					ignore: ['node_modules'],
					deep: 1,
					// absolute: true,
					onlyFiles: true
				})
			)

			// for (const fn of fileList) {
			// const input = resolve(PACKAGE, name, 'src', fn)

			const writeOptions: OutputOptions[] = []
			// output mjs
			if (mjs !== false) {
				writeOptions.push({
					// file: resolve(PACKAGE, name, output, fn.replace(/\.ts$/, '.mjs')),
					exports: 'auto',
					extend: true,
					dir: resolve(PACKAGE, name, output),
					preserveModules: true,
					entryFileNames: '[name].mjs',
					preserveModulesRoot: resolve(PACKAGE, name, 'src'),
					banner,
					format: 'es'
				})
			}
			// output cjs
			// if (cjs !== false) {
			// 	writeOptions.push({
			// 		// file: resolve(PACKAGE, name, output, fn.replace(/\.ts$/, '.js')),
			// 		exports: 'auto',
			// 		extend: true,
			// 		dir: resolve(PACKAGE, name, output),
			// 		preserveModules: true,
			// 		entryFileNames: '[name].js',
			// 		preserveModulesRoot: resolve(PACKAGE, name, 'src'),
			// 		banner,
			// 		format: 'cjs'
			// 	})
			// }
			// output iife
			// if (iife !== false) {
			// 	writeOptions.push(
			// 		{
			// 			file: resolve(PACKAGE, name, output, fn.replace(/\.ts$/, 'iife.js')),
			// 			format: 'iife',
			// 			exports: 'auto',
			// 			name: iifeName,
			// 			extend: true,
			// 			globals: iifeGlobals,
			// 			banner,
			// 			plugins: [
			// 				// injectEslintSetsCore,
			// 			]
			// 		},
			// 		{
			// 			file: resolve(PACKAGE, name, output, fn.replace(/\.ts$/, 'iife.min.js')),
			// 			format: 'iife',
			// 			exports: 'auto',
			// 			name: iifeName,
			// 			extend: true,
			// 			globals: iifeGlobals,
			// 			plugins: [
			// 				// injectEslintSetsCore,
			// 				minify({
			// 					minify: true
			// 				}),
			// 				bannerPlugin(),
			// 				filesize
			// 			]
			// 		}
			// 	)
			// }
			const input: Record<string, string> = {}
			fileList.forEach(file => {
				input[file.slice(0, file.length - extname(file).length)] = resolve(
					PACKAGE,
					name,
					'src',
					file
				)
			})
			const rollupConfig = {
				input,
				plugins: [
					// alias({
					// 	entries: [
					// 		{
					// 			find: /^@\//,
					// 			replacement: resolve(PACKAGE, name, 'src')
					// 		},
					// 		{
					// 			find: /^#conf(.+)$/,
					// 			replacement: resolve(PACKAGE, name, 'src', 'conf') + '$1.mjs'
					// 		}
					// 	]
					// }),
					nodeResolve(),
					replace({
						preventAssignment: true,
						__VERSION__: version
					}),
					json,
					commonjs,
					shebang(),
					esbuild(),
					// target ? esbuild({ target }) : esbuild(),
					filesize
				],
				external: generateExternal({ name, input: '' }, [...externals, ...external]),
				onwarn: (msg: any, warn: any) => {
					if (!/Circular/.test(msg)) {
						warn(msg)
					}
				}
			}
			const bundle = await rollup(rollupConfig)
			await Promise.all(writeOptions.map(option => bundle.write(option)))
		}
		// }
	)
	await Promise.all(builds)
}

export async function madgeLib() {
	for (const { name, output = 'dist' } of pkgs) {
		await runExec(`npx madge ${output}/ -c`, resolve(PACKAGE, name))
	}
}

export async function copyLibFile() {
	for (const { name, output = 'dist' } of pkgs) {
		await runExec(
			`rsync -av --exclude="*.ts" ${resolve(PACKAGE, name, 'src')}/ ${resolve(
				PACKAGE,
				name,
				output
			)}/`
		)
	}
}

export async function cleanDirs() {
	for (const { name, output = 'dist' } of pkgs) {
		await runSpawnSync(`rimraf ${output}`, resolve(PACKAGE, name))
	}
}

export async function genVersion() {
	await runSpawnSync(`pnpm gen:version`)
}

export default series(
	wrapDisplayName('clean:dirs', cleanDirs),
	// wrapDisplayName('gen:version', genVersion),
	parallel(wrapDisplayName('build:lib', buildLib)),
	parallel(wrapDisplayName('madge:lib', madgeLib)),
	parallel(wrapDisplayName('copy:json,sh', copyLibFile))
)
