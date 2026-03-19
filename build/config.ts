import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const pkg = require('../package.json')

export const banner =
	`/*!\n` +
	` * ${
	pkg.name
	} v${
	pkg.version
	}\n` +
	` * ${
	pkg.description
	}\n` +
	` * (c) 2021-present saqqdy<https://github.com/saqqdy> \n` +
	` * Released under the MIT License.\n` +
	` */`
export const bannerText =
	`${pkg.name
	} v${
	pkg.version
	}\n${
	pkg.description
	}\n` +
	`(c) 2021-present saqqdy<https://github.com/saqqdy> \n` +
	`Released under the MIT License.`

export const version = pkg.version
export const extensions = [
	'.js',
	'.mjs',
	'.cjs',
	'.jsx',
	'.ts',
	'.mts',
	'.cts',
	'.tsx',
	'.es6',
	'.es',
	'.json',
	'.less',
	'.css',
]

export const jsexclude = /node_modules/
