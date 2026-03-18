import eslintSets from '@eslint-sets/eslint-config'

export default eslintSets({
	vue: true,
	typescript: true,
	ignores: ['lib', 'dist', 'es', '.vitepress'],
	rules: {
		'perfectionist/sort-interfaces': 'off',
		'perfectionist/sort-named-exports': 'off',
		'perfectionist/sort-objects': 'off',
	},
	stylistic: { indent: 'tab' },
})
