export interface PmFromUserAgentType {
	name: string
	version: string
}
/**
 * Detect the package manager used locally
 *
 * @returns userAgent - The detected package manager
 */
function getPackageManager(): PmFromUserAgentType | undefined {
	if (!process.env.npm_config_user_agent) {
		return undefined
	}

	return pmFromUserAgent(process.env.npm_config_user_agent)
}

/**
 * Read the package manager from the user agent
 *
 * @param userAgent - userAgent
 * @returns userAgent - PmFromUserAgentType
 */
function pmFromUserAgent(userAgent: string): PmFromUserAgentType {
	const pmSpec = userAgent.split(' ')[0]
	const position = pmSpec.lastIndexOf('/')

	return {
		name: pmSpec.substr(0, position),
		version: pmSpec.substr(position + 1),
	}
}

export default getPackageManager
