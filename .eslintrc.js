const { simpleTs: config } = require('eslint-config-sets')
const { extend } = require('js-cool')

module.exports = extend(true, config, {
    "extends": ["airbnb", "prettier", "plugin:node/recommended"],
    "plugins": ["prettier"],
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
