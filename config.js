var path = require('path')
var fs = require('fs')
var pkg = require('./package.json')
var nodeExternals = require('webpack-node-externals')
externals = {}

// externals = [Object.assign({}, externals), nodeExternals() /*, /^core-js\/.+$/, /^js-cool\/.+$/*/]

exports.externals = externals
exports.version = pkg.version

exports.extensions = ['.js', '.jsx', '.ts', '.tsx', '.es6', '.es', '.mjs', '.ts', '.json']

exports.alias = {
    '@': path.resolve(__dirname, '../src'),
    postmessager: path.resolve(__dirname, './')
}

exports.jsexclude = /node_modules/
