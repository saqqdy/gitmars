import { join, resolve, sep } from 'node:path'
import assert from 'assert'
import { execSync } from 'node:child_process'
import { existsSync, promises } from 'node:fs'
import { type ParseArgsConfig, parseArgs } from 'node:util'
// import fg from 'fast-glob'
import consola from 'consola'
import {
	cpSync
	// readJSONSync,
	// writeJSONSync
} from '@node-kit/extra.fs'
import { getBundlePackages } from '../build/packages'
// import { version } from '../package.json'

const [, , ...args] = process.argv
const rootDir = resolve(__dirname, '..')
const FILES_COPY_ROOT = ['LICENSE']
// const FILES_COPY_LOCAL = ['README.md', '*.cjs', '*.mjs', '*.d.ts']

const options: ParseArgsConfig['options'] = {
	package: { type: 'string', short: 'p' },
	watch: { type: 'boolean' }
}
const { values, positionals } = parseArgs({
	args,
	options,
	allowPositionals: true
})

const watch = values.watch as boolean
let packageName = positionals[0] || (values.package as string)
try {
	packageName = JSON.parse(packageName)
} catch {}

const packages = getBundlePackages(packageName)

assert(process.cwd() !== __dirname)

async function buildMetaFiles() {
	for (const { name } of packages) {
		if (name === 'monorepo') continue
		const dirName = name.replace(/\./g, sep)
		const packageRoot = resolve(__dirname, '..', 'packages', dirName)
		// const packageDist = resolve(packageRoot, 'dist')

		if (name === 'core')
			await promises.copyFile(
				resolve(rootDir, 'README.md'),
				resolve(packageRoot, 'README.md')
			)

		for (const file of FILES_COPY_ROOT)
			await promises.copyFile(resolve(rootDir, file), resolve(packageRoot, file))

		// const files = await fg(FILES_COPY_LOCAL, { cwd: packageRoot })
		// for (const file of files)
		// 	await promises.copyFile(resolve(packageRoot, file), resolve(packageDist, file))

		// const packageJSON: any = readJSONSync(join(packageRoot, 'package.json'), 'utf8')
		// for (const key of Object.keys(packageJSON.dependencies || {})) {
		// 	if (key.startsWith('@gitmars/')) packageJSON.dependencies[key] = version
		// }
		// for (const key of Object.keys(packageJSON.devDependencies || {})) {
		// 	if (key.startsWith('@gitmars/')) packageJSON.devDependencies[key] = version
		// }
		// writeJSONSync(join(packageDist, 'package.json'), packageJSON)
	}
}

async function build() {
	for (const { build, name, extractTypes, output = 'dist', buildTask = 'bundle' } of packages) {
		const dirName = name.replace(/\./g, sep)
		const cwd = resolve(__dirname, '..', 'packages', dirName)
		const HAS_INDEX_MJS = existsSync(join(cwd, 'src', 'index.mjs'))

		if (build === false || buildTask !== 'bundle') continue

		consola.info('Clean up in: packages/%s', dirName)
		execSync(`rm-all temp ${output} lib dist types`, {
			stdio: 'inherit',
			cwd
		})

		if (HAS_INDEX_MJS) {
			consola.info('Copy index.mjs in: packages/%s', dirName)
			cpSync(join(cwd, 'src', 'index.mjs'), join(cwd, output))
		}

		if (watch) continue

		if (extractTypes === false) continue

		consola.info('Create types: packages/%s', dirName)
		execSync('tsc -p tsconfig.json', {
			stdio: 'inherit',
			cwd
		})
		execSync('api-extractor run', {
			stdio: 'inherit',
			cwd
		})
		execSync('rm-all temp', {
			stdio: 'inherit',
			cwd
		})
	}

	consola.info('Rollup build bundle => %s', packageName)
	execSync(
		`pnpm run build:rollup${watch ? ' --watch' : ''}${
			packageName ? ' --environment BUILD_PACKAGE:' + packageName : ''
		}`,
		{
			stdio: 'inherit'
		}
	)

	consola.info('Gulp build lib => %s', packageName)
	execSync(`pnpm run build1 ${packageName || ''}`, {
		stdio: 'inherit'
	})

	// consola.info("Fix types");
	// execSync("pnpm run types:fix", { stdio: "inherit" });

	// await buildMetaFiles()
}

async function cli() {
	try {
		await build()
	} catch (e) {
		console.error(e)
		process.exit(1)
	}
}

export { build }

if (require.main === module) cli()
