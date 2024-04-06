module.exports = {
	extends: '@eslint-sets/ts',
	rules: {
		camelcase: 0,
		'import/namespace': [2, { allowComputed: true }]
	},
	globals: {
		window: true,
		global: true
	}
}
