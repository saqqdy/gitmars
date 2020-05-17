module.exports = {
	root: true,

	env: {
		node: true
	},

	rules: {
		'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
		'no-debugger': 'off',
		semi: [2, 'never'],
		'vue/no-use-v-if-with-v-for': [0, 'always'],
		'comma-dangle': 'off',
		'one-var': [
			'warn',
			{
				var: 'always',
				let: 'always',
				const: 'never'
			}
		],
		'no-throw-literal': 0,
		'no-new-wrappers': 0,
		'no-useless-escape': 0,
		'no-tabs': 0,
		'no-mixed-spaces-and-tabs': 0,
		'space-before-function-paren': [0, 'always'],
		'no-unused-vars': 0
	},

	parserOptions: {
		ecmaVersion: 6,
		parser: 'babel-eslint'
	}
}
