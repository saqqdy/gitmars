const path = require('path')
const { merge } = require('webpack-merge')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const config = require('./config')
let plugins = [new ProgressBarPlugin()]

const baseConfig = {
    mode: 'production',
    target: 'web',
    entry: './src/index.ts',
    output: {
        // path: path.resolve(process.cwd(), './lib'),
        publicPath: '/',
        filename: 'index.umd.js',
        chunkFilename: '[id].js',
        libraryTarget: 'umd',
        libraryExport: 'default',
        library: 'AxiosQueue',
        umdNamedDefine: true,
        globalObject: "typeof self !== 'undefined' ? self : this"
    },
    resolve: {
        extensions: config.extensions,
        alias: config.alias,
        modules: ['node_modules']
    },
    externals: config.externals,
    performance: {
        hints: false
    },
    stats: {
        children: false
    },
    optimization: {
        minimize: true
    },
    plugins: plugins
}

module.exports = [
    merge(baseConfig, {
        output: {
            path: path.resolve(process.cwd(), './lib')
        },
        module: {
            rules: [
                {
                    test: /\.(ts|js)x?$/,
                    include: process.cwd(),
                    exclude: config.jsexclude,
                    loader: 'babel-loader'
                }
            ]
        }
    })
    // merge(baseConfig, {
    //     output: {
    //         path: path.resolve(process.cwd(), './es')
    //     },
    //     module: {
    //         rules: [
    //             {
    //                 test: /\.(ts|js)x?$/,
    //                 include: process.cwd(),
    //                 exclude: config.jsexclude,
    //                 loader: 'babel-loader',
    //                 options: {
    //                     presets: [
    //                         [
    //                             '@babel/preset-env',
    //                             {
    //                                 loose: true,
    //                                 modules: 'auto',
    //                                 useBuiltIns: 'usage',
    //                                 corejs: 3,
    //                                 targets: ['defaults', 'not IE <= 11', 'maintained node versions']
    //                                 // targets: { chrome: '58', ie: '11' }
    //                             }
    //                         ]
    //                     ]
    //                 }
    //             }
    //         ]
    //     }
    // })
]
