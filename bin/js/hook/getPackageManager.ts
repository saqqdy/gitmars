export type PmFromUserAgentType = {
    name: string
    version: string
}
/**
 * getPackageManager
 * @description 获取本地使用的包管理工具
 * @returns {Object} arr 返回对象
 */
function getPackageManager(): PmFromUserAgentType | undefined {
    if (!process.env.npm_config_user_agent) {
        return undefined
    }
    return pmFromUserAgent(process.env.npm_config_user_agent)
}

/**
 * pmFromUserAgent
 * @description 读取UA里面的pm
 * @returns {Object} arr 返回对象
 */
function pmFromUserAgent(userAgent: string): PmFromUserAgentType {
    const pmSpec = userAgent.split(' ')[0]
    const pos = pmSpec.lastIndexOf('/')
    return {
        name: pmSpec.substr(0, pos),
        version: pmSpec.substr(pos + 1)
    }
}

module.exports = getPackageManager
