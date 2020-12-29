;(function (root) {
	const cmdConfig = {
		command: 'combine',
		short: 'cb',
		args: [
			{ required: false, name: 'type', variadic: false, validator: null, transformer: null, description: '分支类型' },
			{ required: false, name: 'name', variadic: false, validator: null, transformer: null, description: '分支名称(不带feature/bugfix前缀)' }
		],
		options: [
			{
				flags: '-d, --dev',
				required: false, // 必填<>
				optional: false, // 不必填[]
				variadic: false, // 有...
				mandatory: false,
				short: '-d',
				long: '--dev',
				negate: false,
				description: '同步到dev环境',
				defaultValue: false,
				value: true,
				recommend: true // 自定义值：是否默认选中
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
				description: '同步到prod环境',
				defaultValue: false,
				value: false,
				recommend: false
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
				description: '构建应用',
				value: 'all',
				recommend: true
			},
			{
				flags: '-m, --commit <commit>',
				required: true,
				optional: false,
				variadic: false,
				mandatory: false,
				short: '-m',
				long: '--commit',
				negate: false,
				description: '执行commit，需填写信息',
				defaultValue: '',
				recommend: false
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
				description: '执行add',
				defaultValue: false,
				recommend: false
			},
			{
				flags: '--no-bugfix',
				required: false,
				optional: false,
				variadic: false,
				mandatory: false,
				long: '--no-bugfix',
				negate: true,
				description: 'bug分支合并到release时不合并到bug分支',
				defaultValue: true,
				recommend: false
			},
			{
				flags: '--as-feature',
				required: false,
				optional: false,
				variadic: false,
				mandatory: false,
				long: '--as-feature',
				negate: false,
				description: 'bug分支合并到release',
				recommend: false
			}
		],
		// 校验传值
		validatorOpts: (val, opts, cb) => {
			if (!val.includes('--dev') && !val.includes('--prod')) {
				cb(new Error('合并dev或者prod必须至少选一个'))
				return
			}
			if ((val.includes('--add') && !val.includes('--commit')) || (!val.includes('--add') && val.includes('--commit'))) {
				cb(new Error('add和commit需要同时选择'))
				return
			}
			cb()
		},
		// 校验参数
		validatorArgs: (val, opts, cb) => {
			cb()
		},
		// 清洗传值
		transformOpts: (val, opts, cb) => {
			cb()
		},
		// 清洗参数
		transformArgs: (val, opts, cb) => {
			cb()
		}
	}

	// console.info(typeof exports, typeof module, typeof define, typeof exports)

	/* istanbul ignore next */
	if (typeof exports === 'object' && typeof module === 'object') module.exports = cmdConfig
	// else if (typeof define === 'function' && define.amd) define(['cmdConfig'], () => cmdConfig)
	else if (typeof exports === 'object') exports['cmdConfig'] = cmdConfig
	else root['cmdConfig'] = cmdConfig
})(typeof window !== 'undefined' ? window : global)
