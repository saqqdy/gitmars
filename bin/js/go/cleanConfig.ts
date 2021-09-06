/**
 * @description 清理参数
 * @public
 * @param {object} config 配置
 * @param {object} sets 清理设置
 * @param {array} sets.delOptions 删除option
 * @param {array} sets.requiredOptions 必填option
 * @param {array} sets.delArgs 删除参数
 * @param {array} sets.requiredArgs 必填参数
 * @returns {object} result 返回config
 */
const cleanConfig = (config, sets = {}) => {
    const { delOptions = [], requiredOptions = [], delArgs = [], requiredArgs = [] } = sets
    if (delOptions.length) {
        let len = config.options.length
        while (len--) {
            if (delOptions.includes(config.options[len].long)) {
                config.options.splice(len, 1)
            }
        }
    }
    if (delArgs.length) {
        let len = config.args.length
        while (len--) {
            if (delArgs.includes(config.args[len].name)) {
                config.args.splice(len, 1)
            }
        }
    }
    if (requiredOptions.length) {
        let len = config.options.length
        while (len--) {
            if (requiredOptions.includes(config.options[len].long)) {
                config.options[len].required = true
            }
        }
    }
    if (requiredArgs.length) {
        let len = config.args.length
        while (len--) {
            if (requiredArgs.includes(config.args[len].name)) {
                config.args[len].required = true
            }
        }
    }
    return config
}

module.exports = cleanConfig
