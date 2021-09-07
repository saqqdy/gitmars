module.exports = {
    presets: [
        [
            '@babel/env',
            {
                loose: true,
                modules: 'auto',
                useBuiltIns: 'usage',
                corejs: 3
            }
        ],
        '@babel/preset-typescript'
    ]
}
