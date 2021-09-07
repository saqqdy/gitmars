const { simpleTs: config } = require('eslint-config-sets')
const { extend } = require('js-cool')

module.exports = extend(true, config, {
    rules: {
        'no-unused-vars': [1, { ignoreRestSiblings: true, argsIgnorePattern: '^h$' }],
        '@typescript-eslint/no-unused-vars': [
            1,
            {
                argsIgnorePattern: '^h$',
                varsIgnorePattern: '^h$'
            }
        ]
    }
})
