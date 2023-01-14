import { resolve } from 'path'
import { execSync } from 'child_process'
import { promises, readFileSync, writeFileSync } from 'fs'
import { packages } from '../build/packages'
import { version } from '../package.json'

async function updatePackageJSON() {
	for (const { name, display, author, iife } of packages) {
		const packageRoot = resolve(__dirname, '..', 'packages', name)
		const packageJSONPath = resolve(packageRoot, 'package.json')
		const packageJSON = JSON.parse(readFileSync(packageJSONPath, 'utf8'))
		packageJSON.version = version
		packageJSON.description = display || packageJSON.description
		packageJSON.author = author || 'saqqdy <https://github.com/saqqdy>'
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
		// packageJSON.main = './lib/index.js'
		// packageJSON.types = './index.d.ts'
		// packageJSON.module = './index.mjs'
		if (iife !== false) {
			packageJSON.unpkg = './index.iife.min.js'
			packageJSON.jsdelivr = './index.iife.min.js'
		}
		// packageJSON.exports = {
		//     '.': {
		//         import: './index.mjs',
		//         require: './index.cjs',
		//         types: './index.d.ts'
		//     },
		//     './*': './*',
		//     ...packageJSON.exports
		// }
		writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 4))
	}
}

async function run() {
	await updatePackageJSON()
	await promises.copyFile('./CONTRIBUTING.md', './packages/contributing.md')
	execSync('pnpm run prettier')
}

run()
