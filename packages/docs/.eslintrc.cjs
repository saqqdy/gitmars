module.exports = {
	extends: '@eslint-sets/vue3',
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
