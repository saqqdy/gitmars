;(function (root) {
	const cmdConfig = {
		command: 'combine',
		short: 'cb',
		args: [
			{ required: false, name: 'type', variadic: false },
			{ required: false, name: 'name', variadic: false }
		],
		options: [
			{
				flags: '-d, --dev',
				required: false,
				optional: false,
				variadic: false,
				mandatory: false,
				short: '-d',
				long: '--dev',
				negate: false,
				description: '是否同步到alpha测试环境',
				defaultValue: false,
				value: true,
				validator: (value, options, cb) => {
					if (!value['--dev'] && !value['--prod']) {
						cb(new Error('请选择同步的环境'))
					} else {
						cb()
					}
				}
			},
			{
				flags: '-p, --prod',
				required: false,
				optional: false,
				variadic: false,
				mandatory: false,
				short: '-p',
				long: '--prod',
				negate: false,
				description: '是否同步到预发布环境',
				defaultValue: false,
				value: false
			},
			{
				flags: '-b, --build [build]',
				required: false,
				optional: true,
				variadic: false,
				mandatory: false,
				short: '-b',
				long: '--build',
				negate: false,
				description: '需要构建的应用',
				value: 'all'
			},
			{
				flags: '-m, --commit [commit]',
				required: false,
				optional: true,
				variadic: false,
				mandatory: false,
				short: '-m',
				long: '--commit',
				negate: false,
				description: 'commit信息',
				defaultValue: ''
			},
			{
				flags: '-a, --add',
				required: false,
				optional: false,
				variadic: false,
				mandatory: false,
				short: '-a',
				long: '--add',
				negate: false,
				description: '需要add',
				defaultValue: false
			},
			{
				flags: '--no-bugfix',
				required: false,
				optional: false,
				variadic: false,
				mandatory: false,
				long: '--no-bugfix',
				negate: true,
				description: '不同步到bug分支',
				defaultValue: true
			},
			{
				flags: '--as-feature',
				required: false,
				optional: false,
				variadic: false,
				mandatory: false,
				long: '--as-feature',
				negate: false,
				description: 'bug分支合并到release'
			}
		]
	}

	// console.info(typeof exports, typeof module, typeof define, typeof exports)

	/* istanbul ignore next */
	if (typeof exports === 'object' && typeof module === 'object') module.exports = cmdConfig
	// else if (typeof define === 'function' && define.amd) define(['cmdConfig'], () => cmdConfig)
	else if (typeof exports === 'object') exports['cmdConfig'] = cmdConfig
	else root['cmdConfig'] = cmdConfig
})(typeof window !== 'undefined' ? window : global)
