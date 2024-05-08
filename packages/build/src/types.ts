export type VersionControlType = 'patch' | 'minor' | 'major' | false

export interface GitmarsConfigApisBuildConfigType {
	url: string
	method?: 'post' | 'get' | 'put' | 'delete'
	params?: Record<string, string | number | boolean | null>
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
	token?: string
	apps?: string[]
	miniprogram?: ApolloConfigProjectMiniprogram[]
}

export interface ApolloConfigBranchType {
	line: string
	token: string
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
	template: string // 不带参数
	templateWithParam: string // 带参数
	gitNotificationGroupUrl?: string | string[] // 推送群消息的api
}
