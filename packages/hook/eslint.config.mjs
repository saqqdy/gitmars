import eslintSets from '@eslint-sets/eslint-config'

export default eslintSets({
	typescript: true,
	ignores: ['lib', 'dist', 'es'],
	rules: {
		camelcase: 'off',
		'perfectionist/sort-interfaces': 'off',
		'perfectionist/sort-named-exports': 'off',
		'perfectionist/sort-objects': 'off',
	},
	stylistic: { indent: 'tab' },
})
