export interface PmFromUserAgentType {
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
    const position = pmSpec.lastIndexOf('/')
    return {
        name: pmSpec.substr(0, position),
        version: pmSpec.substr(position + 1)
    }
}

export default getPackageManager
