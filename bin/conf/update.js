;(function (root) {
	const cmdConfig = {
		command: 'update',
		short: 'up',
		args: [
			{ required: false, name: 'type', variadic: false, description: '分支类型' },
			{ required: false, name: 'name', variadic: false, description: '分支名称(不带feature/bugfix前缀)' }
		],
		options: [
			{
				flags: '--use-merge',
				required: false,
				optional: false,
				variadic: false,
				mandatory: false,
				long: '--use-merge',
				negate: false,
				description: '使用merge方式更新(默认rebase)',
				defaultValue: false,
				recommend: true
			}
		]
	}

	/* istanbul ignore next */
	if (typeof exports === 'object' && typeof module === 'object') module.exports = cmdConfig
	// else if (typeof define === 'function' && define.amd) define(['cmdConfig'], () => cmdConfig)
	else if (typeof exports === 'object') exports['cmdConfig'] = cmdConfig
	else root['cmdConfig'] = cmdConfig
})(typeof window !== 'undefined' ? window : global)
