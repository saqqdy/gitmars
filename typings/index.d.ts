/// <reference types="node" />

export interface AnyObject {
    [prop: string]: any
}

export interface AnyFunction extends AnyObject {
    (...args: any[]): any
}

export type ValueOf<T> = T extends ReadonlyArray<any> ? T[number] : T[keyof T]

// export function GitmarsOptionFunctionType(val: string, opts: object, cb: any): void

export type GitmarsBranchType = 'feature' | 'bugfix' | 'support'

// 127和128是git个别场景的执行结果值
export type ShellCode = 0 | 1 | 127 | 128

export type PackageVersionTag =
    | 'alpha'
    | 'lite'
    | 'beta'
    | 'release'
    | 'latest'
    | 'next'

export interface GitmarsOptionArgsType {
    required: boolean
    name: string
    variadic: boolean
    validator?(val: string, opts: object, cb: Function): void
    transformer?(
        val: string,
        answers: object,
        flags: object,
        options: GitmarsOptionArgsType
    ): void
    description?: string
    defaultValue?: any
    options?: Array<string | number>
    value?: string
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
    options?: Array<string | number>
    validator?(val: string, opts: object, cb: Function): void
    transformer?(
        val: string,
        answers: object,
        flags: object,
        options: GitmarsOptionOptionsType
    ): void
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

export interface ModuleCommandType {
    module: string
    entry?: string
    options?: unknown
}

export interface CommandType {
    cmd: string | ModuleCommandType
    config: QueueConfigType
}

export interface FetchDataType {
    token: string // gitlab上生成的access_token
    level: 1 | 2 | 3 // 1=超级管理员 2=管理员 3=开发者
    [prop: string]: any
}

export type GitStatusListType = 'A' | 'D' | 'M' | '??'

export type GitStatusInfoType = {
    [props in GitStatusListType]: string[]
}

export interface QueueConfigType {
    silent?: boolean
    again?: boolean
    processing?: string
    success?: string
    fail?: string
    postmsg?: boolean
    kill?: boolean
}

export interface QueueReturnsType {
    code: ShellCode
    out: string
    err: string
    cfg: QueueConfigType
    cmd: string | ModuleCommandType
}

export interface InitInquirerPromptType {
    type: string
    name: string
    message: string
    default?(): string
    transformer?(val: any, answers: any, flags: any): any
    validate?(val: any): string | boolean
    choices?: any
}

export interface GitLogType {
    [props: string]: string
}

export interface CommandMessageType {
    processing: string
    success: string
    fail: string
}
