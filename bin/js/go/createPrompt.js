const { success, warning, error } = require('../index')

/**
 * @description 创建promot参数
 * @param {object} option 配置
 * @returns {opject} 返回prompt
 */
const createPrompt = (command, { options, validator, transform }, type) => {
	if (type === 'checkbox') {
		if (!options.length) return null
		prompt = {
			type,
			message: '请选择',
			name: command,
			choices: [],
			validate: answer => {
				if (validator) {
					let msg = true
					validator(answer, options, err => {
						if (err) msg = err.message
					})
					return msg
				}
				return true
			}
		}
		options.forEach(option => {
			prompt.choices.push({
				name: option.description,
				value: option.long,
				checked: option.recommend
			})
		})
		return prompt
	} else if (type === 'input') {
		let list = []
		options.forEach(({ validator, transformer, ...opts }) => {
			let cfg = {
				type: 'input',
				name: opts.name,
				message: `${opts.description || '请输入参数' + opts.name + '的值'}${!opts.required ? warning('(可不填' + (!['', undefined].includes(opts.defaultValue) ? '，默认"' + opts.defaultValue + '"' : '') + ')') : ''}`,
				transformer: (val, answers, flags) => {
					if (!transformer) {
						return val
					} else if (transformer instanceof Function) {
						return transformer(val, answers, flags, opts)
					}
				},
				validate: val => {
					let msg = true
					if (!val && opts.required) msg = '请填写' + opts.description
					validator &&
						msg === true &&
						validator(val, opts, () => {
							if (err) msg = err.message
						})
					return msg
				}
			}
			if (opts.defaultValue !== '') cfg.defaultValue = opts.defaultValue
			list.push(cfg)
		})
		return list
	}
}

module.exports = createPrompt
