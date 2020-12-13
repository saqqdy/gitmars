;(function (root) {
	const cmdConfig = {
		command: 'hook',
		short: 'hk',
		args: [
			{
				required: false,
				name: 'command',
				variadic: false
			}
		],
		options: [
			{
				flags: '--no-verify',
				required: false,
				optional: false,
				variadic: false,
				mandatory: false,
				long: '--no-verify',
				negate: true,
				description: '是否需要跳过校验权限',
				defaultValue: false
			},
			{
				flags: '--latest [latest]',
				required: false,
				optional: false,
				variadic: false,
				mandatory: false,
				short: '',
				long: '--latest',
				negate: false,
				description: '查询在某个时间之后的日志，填写格式：10s/2m/2h/3d/4M/5y',
				defaultValue: '7d'
			},
			{
				flags: '--limit [limit]',
				required: false,
				optional: false,
				variadic: false,
				mandatory: false,
				short: '',
				long: '--limit',
				negate: false,
				description: '最多查询的日志条数',
				defaultValue: 20
			},
			{
				flags: '--branch [branch]',
				required: false,
				optional: false,
				variadic: false,
				mandatory: false,
				short: '',
				long: '--branch',
				negate: false,
				description: '要查询的分支',
				defaultValue: ''
			}
		]
	}

	/* istanbul ignore next */
	if (typeof exports === 'object' && typeof module === 'object') module.exports = cmdConfig
	// else if (typeof define === 'function' && define.amd) define(['cmdConfig'], () => cmdConfig)
	else if (typeof exports === 'object') exports['cmdConfig'] = cmdConfig
	else root['cmdConfig'] = cmdConfig
})(typeof window !== 'undefined' ? window : global)
