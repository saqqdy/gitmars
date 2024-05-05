import { resolve, sep } from 'path'
import { execSync } from 'child_process'
import { promises } from 'fs'
import { readJSONSync, writeJSONSync } from '@node-kit/extra.fs'
import { packages } from '../build/packages'
import { version } from '../package.json'

async function updatePackageJSON() {
	for (const { name, display, iife, browser } of packages) {
		if (name === 'monorepo') continue
		const dirName = name.replace(/\./g, sep)
		const packageRoot = resolve(__dirname, '..', 'packages', dirName)
		const packageJSONPath = resolve(packageRoot, 'package.json')
		const packageJSON = readJSONSync(packageJSONPath)!
		packageJSON.version = version
		packageJSON.description = display || packageJSON.description
		packageJSON.author = 'saqqdy <https://github.com/saqqdy>'
		packageJSON.bugs = {
			url: 'https://github.com/saqqdy/gitmars/issues'
		}
		packageJSON.homepage =
			name === 'gitmars'
				? 'https://www.saqqdy.com/gitmars'
				: `https://github.com/saqqdy/gitmars/tree/master/packages/${name}#readme`
		packageJSON.repository = {
			type: 'git',
			url: 'git+https://github.com/saqqdy/gitmars.git',
			directory: `packages/${name}`
		}
		packageJSON.module = './dist/index.esm-bundler.js'
		packageJSON.main = './dist/index.cjs.js'
		packageJSON.types = './dist/index.d.ts'
		if (browser !== false) {
			packageJSON.browser = 'dist/index.esm-browser.js'
		}
		if (iife !== false) {
			packageJSON.unpkg = 'dist/index.global.prod.js'
			packageJSON.jsdelivr = 'dist/index.global.prod.js'
		}
		// packageJSON.exports = {
		// 	'.': {
		// 		types: './dist/index.d.ts',
		// 		module: './dist/index.esm-bundler.js',
		// 		require: './dist/index.cjs.js',
		// 		import: './dist/index.mjs'
		// 	},
		// 	'./*': './*',
		// 	...packageJSON.exports
		// }
		writeJSONSync(packageJSONPath, packageJSON)
	}
}

async function run() {
	await updatePackageJSON()
	await promises.copyFile('./CONTRIBUTING.md', './packages/contributing.md')
	execSync('pnpm run prettier')
}

run()
