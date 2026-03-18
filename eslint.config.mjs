import eslintSets from '@eslint-sets/eslint-config'

export default eslintSets({
	ignores: [
		'packages/**/lib',
		'packages/**/dist',
		'packages/**/es',
		'packages/docs/.vitepress',
	],
	markdown: false,
	rules: {
		camelcase: 'off',
		'perfectionist/sort-interfaces': 'off',
		'perfectionist/sort-named-exports': 'off',
		'perfectionist/sort-objects': 'off',
		'ts/no-require-imports': 'off',
		'yml/file-extension': 'off',
	},
	stylistic: { indent: 'tab' },
	typescript: true,
	vue: true,
})
