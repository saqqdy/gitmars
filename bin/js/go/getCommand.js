const inquirer = require('inquirer')
const createPrompt = require('./createPrompt')

/**
 * @description 执行问答程序
 * @public
 * @param {object} config 配置
 * @param {string} config.command 指令名称
 * @param {object} config.args 指令参数
 * @param {object} config.options 指令传参
 * @param {object} config.validatorOpts 校验参数
 * @param {object} config.validatorArg 校验传参
 * @param {object} config.transformOpts 参数值转换
 * @param {object} config.transformArgs 传参值转换
 * @returns {string} result 返回指令结果Promise
 */
const getCommand = async ({ command, args, options, validatorOpts, validatorArg, transformOpts, transformArgs }) => {
    let params = [],
        needInput = [] // 需要输入参数值的列表
    // 第一步：args参数
    if (options.length > 0) {
        // 是否需要执行第一步checkbox选择：1. options全部参数都需要输入值；2. 全部参数都是recommend为true，满足这两个条件则不走checkbox。
        const needStep1 = options.some(option => (!option.optional && !option.required) || !option.recommend)
        if (needStep1) {
            const answer1 = await inquirer.prompt(createPrompt(command, { options, validator: validatorOpts, transform: transformOpts }, 'checkbox'))
            const { [command]: selection } = answer1
            selection.forEach(prop => {
                let option = options.find(opt => opt.long === prop)
                if (option.optional || option.required) {
                    // 必填<>或者不必填[]
                    needInput.push({
                        required: option.required,
                        name: option.long,
                        variadic: false,
                        defaultValue: option.defaultValue,
                        description: option.description
                    })
                } else {
                    params.push(prop)
                }
            })
        } else {
            needInput = options.map(option => {
                return {
                    required: option.required,
                    name: option.long,
                    variadic: false,
                    defaultValue: option.defaultValue,
                    description: option.description
                }
            })
        }
    }
    // 第二步：command参数
    if (args.length > 0) {
        const answer2 = await inquirer.prompt(createPrompt(command, { options: args, validator: validatorArg, transform: transformArgs }, 'input'))
        params = [].concat(Object.values(answer2)).concat(params)
    }
    // 第三步：args参数需要传参的部分
    if (needInput.length > 0) {
        const answer3 = await inquirer.prompt(createPrompt(command, { options: needInput }, 'input'))
        let arr = Object.entries(answer3).map(item => {
            if (item[1] !== '') item[1] = '"' + item[1] + '"'
            return item
        })
        params = params.concat(arr.flat(Infinity))
    }
    return Promise.resolve(`${params.join(' ').replace(/\s+/g, ' ').trim()}`)
}

module.exports = getCommand
