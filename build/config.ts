import pkg from '../package.json' assert { type: 'json' }

export const banner =
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
export const bannerText =
	pkg.name +
	' v' +
	pkg.version +
	'\n' +
	pkg.description +
	'\n' +
	'(c) 2021-' +
	new Date().getFullYear() +
	' saqqdy<https://github.com/saqqdy> \n' +
	'Released under the MIT License.'

export const version = pkg.version
export const extensions = [
	'.mjs',
	'.js',
	'.jsx',
	'.ts',
	'.tsx',
	'.es6',
	'.es',
	'.json',
	'.less',
	'.css'
]

export const jsexclude = /node_modules/
