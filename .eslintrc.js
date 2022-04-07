module.exports = {
    extends: ['@eslint-sets/vue3-ts'],
    rules: {
        camelcase: 1,
        'no-labels': 1,
        indent: [2, 4, { SwitchCase: 1 }]
    },
    globals: {
        __DEV_MODEL__: true,
        __DEV__: true,
        __QA__: true,
        __YZ__: true,
        __DEMO__: true,
        __PROD__: true
    }
}
