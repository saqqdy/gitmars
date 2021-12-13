const { simpleTs: config } = require('eslint-config-sets')
const { extend } = require('js-cool')

module.exports = extend(true, config, {
    // plugins: [...(config.plugins || []), 'prettier'],
    globals: {
        __DEV_MODEL__: true,
        __DEV__: true,
        __QA__: true,
        __YZ__: true,
        __DEMO__: true,
        __PROD__: true
    },
    rules: {
        'no-unused-vars': 0,
        '@typescript-eslint/no-unused-vars': [
            1,
            {
                argsIgnorePattern: '^h$',
                varsIgnorePattern: '^h$'
            }
        ]
    }
})
