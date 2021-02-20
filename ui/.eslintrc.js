module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: ['plugin:vue/vue3-essential', 'eslint:recommended', 'prettier'],
	parserOptions: {
		parser: 'babel-eslint'
	},
	rules: {
		'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
		'no-debugger': 1,
		semi: [2, 'never'],
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
		'no-new-wrappers': 2,
		'no-useless-escape': 0,
		'no-redeclare': 2,
		'no-tabs': 0,
		'no-mixed-spaces-and-tabs': 1,
		'space-before-function-paren': [0, 'always'],
		'object-shorthand': 2,
		'no-unused-vars': [2, { ignoreRestSiblings: true, argsIgnorePattern: '^h$' }],
		'no-dupe-keys': 2,
		'no-func-assign': 2,
		'valid-typeof': 2,
		'no-shadow': 0,
		'no-prototype-builtins': 0,
		'no-undef': 2,
		'no-irregular-whitespace': 1,
		'vue/no-use-v-if-with-v-for': [2, { allowUsingIterationVar: false }],
		'vue-scoped-css/require-scoped': 2,
		'vue/no-multiple-template-root': 0,
		// 'vue/no-v-model-argument': 'off',
		// 'vue/valid-v-model': 0,
		'vue/max-attributes-per-line': [
			2,
			{
				singleline: 20,
				multiline: {
					max: 1,
					allowFirstLine: false
				}
			}
		]
	},
	globals: {
		h: true
	},
	overrides: [
		{
			files: ['*.vue'],
			rules: {
				'vue/no-v-model-argument': 'off',
				'vue/valid-v-model': 0
			}
		}
	]
}
