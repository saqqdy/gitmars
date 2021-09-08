const { warning } = require('../index')

export interface PromptOptionType {
    options: any
    validator: any
    transform: any
}

/**
 * @description 创建promot参数
 * @param {string} command 指令名称
 * @param {object} config 配置
 * @param {object} config.options 配置参数
 * @param {object} config.validator 校验器
 * @param {object} config.transform 参数转换
 * @param {object} type 类型checkbox/input/list
 * @returns {opject} 返回prompt
 */
const createPrompt = (command, { options, validator, transform }, type) => {
    if (type === 'checkbox') {
        if (!options.length) return null
        let promptOpt = {
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
            promptOpt.choices.push({
                name: option.description,
                value: option.long,
                checked: option.recommend
            })
        })
        return promptOpt
    } else if (type === 'input') {
        let list = []
        options.forEach(({ validator: childValidator, transformer, ...opts }) => {
            // 优先使用每个参数设置的校验
            if (childValidator) validator = childValidator
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
                        validator(val, opts, err => {
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

export default createPrompt
