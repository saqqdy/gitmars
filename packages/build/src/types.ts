export type VersionControlType = 'patch' | 'minor' | 'major' | false

export interface GitmarsConfigApisBuildConfigType {
	url: string
	method?: 'post' | 'get' | 'put' | 'delete'
	params?: Record<string, string | number | boolean | null>
}

/**
 * Build secret config.
 *
 * Stored under the buildSecret field of .gitmarsrc. Supports both the project root
 * and the global ~/.gitmarsrc; project-level entries take precedence over global
 * ones (project fields override global fields of the same name).
 * Sensitive data is provided here rather than via the build config API.
 * Note: per-env Jenkins tokens are NOT secret and are still returned via the API.
 */
export interface BuildSecretType {
	username?: string
	password?: string
	miniprogramToken?: string
	miniprogramSession?: string
	gitNotificationGroupUrl?: string | string[]
}

export interface GitmarsConfigType {
	master: string
	develop: string
	release: string
	bugfix: string
	support: string
	user?: string
	email?: string
	skipCI?: boolean
	msgTemplate?: string
	apolloConfig?: {
		configServerUrl: string
		appId: string
		clusterName: string
		namespaceName: string[]
		apolloEnv: string
		token: string
	}
	apis?: Record<string, GitmarsConfigApisBuildConfigType>
	buildSecret?: BuildSecretType
	api?: string
	gitHost?: string
	gitID?: string
	hooks?: Record<string, string>
	filepath?: string
	nameValidator?: string | RegExp
	descriptionValidator?: string | RegExp
	versionControlType?: VersionControlType
} // & Record<string, unknown>

export type GitmarsConfigProperty = keyof GitmarsConfigType
// | 'master'
// | 'develop'
// | 'release'
// | 'bugfix'
// | 'support'
// | 'user'
// | 'email'
// | 'skipCI'
// | 'msgTemplate'
// | 'apolloConfig'
// | 'apis'
// | 'api'
// | 'gitHost'
// | 'gitID'
// | 'hooks'
// | 'filepath'
// | 'nameValidator'
// | 'descriptionValidator'

export type ApolloBranchList = 'dev' | 'bug' | 'prod'

export interface ApolloConfigProjectMiniprogram {
	value: string
	name: string
}

export interface ApolloConfigProjectType {
	name: string
	project: string
	schema?: string
	apps?: string[]
	miniprogram?: ApolloConfigProjectMiniprogram[]
}

export interface ApolloConfigBranchType {
	line: string
	schema: string
	list: ApolloConfigProjectType[]
}

export type ApolloConfigType = {
	[props in ApolloBranchList]: ApolloConfigBranchType
} & {
	username: string
	password: string
	miniprogramDomain?: string
	miniprogramToken?: string
	miniprogramSession?: string
	template: string // Without parameters
	templateWithParam: string // With parameters
	gitNotificationGroupUrl?: string | string[] // API for pushing group messages
}
