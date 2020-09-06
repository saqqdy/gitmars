module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/prettier'],
	parserOptions: {
		parser: 'babel-eslint'
	},
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'vue/no-multiple-template-root': 0,
		'vue/no-v-model-argument': 0,
		'no-prototype-builtins': 0
	}
}
