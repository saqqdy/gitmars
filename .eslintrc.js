const { simpleTs: config } = require('eslint-config-sets')
const { extend } = require('js-cool')
const { dependencies, devDependencies } = require('./package.json')
let { 'cSpell.words': skipWords } = require('./.vscode/settings.json')
skipWords = skipWords
    .concat(Object.keys(dependencies))
    .concat(Object.keys(devDependencies))

module.exports = extend(true, config, {
    plugins: [...(config.plugins || []), 'spellcheck', 'prettier'],
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
        ],
        'spellcheck/spell-checker': [
            1,
            {
                comments: false,
                strings: false,
                identifiers: true,
                templates: true,
                lang: 'en_US',
                skipWords,
                skipIfMatch: ['http://[^s]*', '^[-\\w]+/[-\\w\\.]+$'],
                skipWordIfMatch: ['^.*gitmars.*$'],
                minLength: 3
            }
        ]
    }
})
