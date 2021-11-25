export type PmFromUserAgentType = {
    name: string
    version: string
}
/**
 * 获取本地使用的包管理工具
 *
 * @returns userAgent - 返回PmFromUserAgent
 */
function getPackageManager(): PmFromUserAgentType | undefined {
    if (!process.env.npm_config_user_agent) {
        return undefined
    }
    return pmFromUserAgent(process.env.npm_config_user_agent)
}

/**
 * 读取UA里面的pm
 *
 * @param userAgent - userAgent
 * @returns userAgent - PmFromUserAgentType
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
export {}
