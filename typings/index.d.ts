export interface AnyObject {
    [prop: string]: any
}

export interface AnyFunction extends AnyObject {
    (...args: any[]): any
}

export interface GitmarsOptionArgsType {
    required: boolean
    name: string
    variadic: boolean
    validator?(val: string, opts: object, cb: any): void
    transformer?(val: string, opts: object, cb: any): void
    description?: string
}

export interface GitmarsOptionOptionsType {
    flags: string
    required: boolean
    optional: boolean
    variadic: boolean
    mandatory: boolean
    short?: string | null
    long: string
    negate: boolean
    description: string
    defaultValue?: any
    value?: any
    recommend?: boolean
}

export interface GitmarsOptionType {
    command: string
    short?: string | null
    args: GitmarsOptionArgsType[]
    options: GitmarsOptionOptionsType[]
    validatorOpts?(val: any, opts: object, cb: Function): void
    validatorArgs?(val: any, opts: object, cb: Function): void
    transformOpts?(val: any, opts: object, cb: Function): void
    transformArgs?(val: any, opts: object, cb: Function): void
}

export interface GitmarsMultiOptionType {
    command: string
    short?: string | null
    create: GitmarsOptionType
    publish: GitmarsOptionType
    update: GitmarsOptionType
    clean: GitmarsOptionType
}

export interface GitmarsConfigType {
    master: string
    develop: string
    release: string
    bugfix: string
    support: string
    user?: string
    email?: string
    skipCI: boolean
    msgTemplate?: string
    msgUrl?: string
    apolloConfig?: {
        configServerUrl: string
        appId: string
        clusterName: string
        namespaceName: string[]
        apolloEnv: string
        token: string
    }
    api?: string
    gitHost?: string
    gitID?: string
    hooks?: {
        [props: string]: string
    }
    filepath: string
}

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
