const { warning } = require('../utils/index')

import {
    GitmarsOptionArgsType,
    GitmarsOptionOptionsType
} from '../../../typings'

export interface PromptConfigType {
    options: GitmarsOptionArgsType[] | GitmarsOptionOptionsType[]
    validator?(val: string, opts: object, cb: any): void
    transform?(val: string, opts: object, cb: any): void
}

export interface PromptOptionCheckboxChoicesType {
    name: string
    value: string
    checked: boolean
}

export interface PromptOptionCheckboxType {
    name: string
    type: string
    message: string
    choices: PromptOptionCheckboxChoicesType[]
    validate(answer: any): string | boolean
}

export interface PromptOptionInputType {
    name: string
    type: string
    message: string
    transformer?(val: any, answers: any, flags: any): any
    validate(answer: any): string | boolean
    defaultValue?: any
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
const createPrompt = (
    command: string,
    { options, validator, transform }: PromptConfigType,
    type: string
) => {
    if (type === 'checkbox') {
        if (!options.length) return null
        const promptOpt: PromptOptionCheckboxType = {
            type,
            message: '请选择',
            name: command,
            choices: [],
            validate: answer => {
                if (validator) {
                    let msg: string | boolean = true
                    validator(answer, options, (err: Error) => {
                        if (err) msg = err.message
                    })
                    return msg
                }
                return true
            }
        }
        ;(options as GitmarsOptionOptionsType[]).forEach(option => {
            promptOpt.choices.push({
                name: option.description || '',
                value: option.long,
                checked: option.recommend || false
            })
        })
        return promptOpt
    } else if (type === 'input') {
        const list: PromptOptionInputType[] = []
        ;(options as GitmarsOptionArgsType[]).forEach(
            ({ validator: childValidator, transformer, ...opts }) => {
                // 优先使用每个参数设置的校验
                if (childValidator) validator = childValidator
                const cfg: PromptOptionInputType = {
                    type: 'input',
                    name: opts.name,
                    message: `${
                        opts.description || '请输入参数' + opts.name + '的值'
                    }${
                        !opts.required
                            ? warning(
                                  '(可不填' +
                                      ('defaultValue' in opts &&
                                      opts.defaultValue !== ''
                                          ? '，默认"' + opts.defaultValue + '"'
                                          : '') +
                                      ')'
                              )
                            : ''
                    }`,
                    transformer: (val: string, answers: object, flags: any) => {
                        if (!transformer) {
                            return val
                        } else if (transformer instanceof Function) {
                            return transformer(val, answers, flags, opts)
                        }
                    },
                    validate: (val): string | boolean => {
                        let msg: string | boolean = true
                        if (!val && opts.required)
                            msg = '请填写' + opts.description
                        validator &&
                            msg === true &&
                            validator(val, opts, (err: Error) => {
                                if (err) msg = err.message
                            })
                        return msg
                    }
                }
                if ('defaultValue' in opts && opts.defaultValue !== '')
                    cfg.defaultValue = opts.defaultValue
                list.push(cfg)
            }
        )
        return list
    }
}

module.exports = createPrompt
