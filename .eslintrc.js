const { simpleTs: config } = require('eslint-config-sets')
const { extend } = require('js-cool')

module.exports = extend(true, config, {
    plugins: ['prettier'],
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
