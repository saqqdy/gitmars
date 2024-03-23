import type { SpawnOptions, SpawnSyncReturns } from 'child_process'

export type ValueOf<T> = T extends ReadonlyArray<any> ? T[number] : T[keyof T]

// export function GitmarsOptionFunctionType(val: string, opts: object, cb: any): void

export type GitmarsBranchType = 'feature' | 'bugfix' | 'support'

export type VersionControlType = 'patch' | 'minor' | 'major' | false

export type ApolloBranchList = 'dev' | 'bug' | 'prod'

export interface ApolloConfigProjectType {
	name: string
	project: string
	apps?: string[]
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
	template: string // 不带参数
	templateWithParam: string // 带参数
	gitNotificationGroupUrl?: string | string[] // 推送群消息的api
}

export interface ModuleCommandType {
	module: string
	entry?: string
	options?: unknown
}

export interface CommandTypeCmd {
	cmd: string | string[] | ModuleCommandType
	config: QueueConfigType
}

export interface CommandTypeMessage {
	message: string
}

export type CommandType = CommandTypeCmd | CommandTypeMessage

export interface QueueConfigType extends SpawnOptions {
	again?: boolean | string
	processing?: string
	success?: string
	fail?: string
	postmsg?: boolean
	kill?: boolean
}

export interface QueueReturnsType
	extends Partial<Pick<SpawnSyncReturns<string>, 'stdout' | 'stderr' | 'status'>> {
	cfg: QueueConfigType
	cmd: string | string[] | ModuleCommandType
}

export interface CommandMessageType {
	processing?: string
	success?: string
	fail?: string
}

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

export interface GitmarsConfigExtend extends GitmarsConfigType {
	skipCI: boolean
	filepath: string
}