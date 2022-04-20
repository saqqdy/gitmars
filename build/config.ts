const path = require('path')
const pkg = require('../package.json')

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

export const extensions = [
    '.js',
    '.jsx',
    '.ts',
    '.tsx',
    '.es6',
    '.es',
    '.mjs',
    '.ts',
    '.json'
]

export const alias = {
    '@': path.resolve(__dirname, '../src'),
    'eslint-sets': path.resolve(__dirname, './')
}

export const jsexclude = /node_modules/
