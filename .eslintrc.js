module.exports = {
	extends: '@eslint-sets/ts',
	rules: {
		camelcase: 0
	},
	globals: {
		window: true,
		global: true
	},
	ignorePatterns: [
		'lib',
		'es',
		'dist',
		'docs',
		'app',
		'ui',
		'cache/*',
		'*_bak',
		'*.bak',
		'pnpm-lock.yaml',
		'stats.html',
		'dist_electron'
	]
}
