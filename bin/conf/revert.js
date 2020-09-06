;(function (root) {
	const cmdConfig = {
		command: 'revert',
		short: 'rt',
		args: [{ required: false, name: 'commitid', variadic: false }],
		options: [
			{
				flags: '-n, --number [number]',
				required: false,
				optional: true,
				variadic: false,
				mandatory: false,
				short: '-n',
				long: '--number',
				negate: false,
				description: '撤销最后一次提交（或者撤销倒数第n次提交）',
				defaultValue: ''
			},
			{
				flags: '-m, --mode [mode]',
				required: false,
				optional: true,
				variadic: false,
				mandatory: false,
				short: '-m',
				long: '--mode',
				negate: false,
				description: '针对撤销一次merge记录，需要传入类型：1 = 保留当前分支代码，2 = 保留传入代码',
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
