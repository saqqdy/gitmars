/// <reference types="node" />

import type { SpawnOptions, SpawnSyncReturns } from 'child_process'

export type AnyObject = Record<string, any>

export interface AnyFunction extends AnyObject {
    (...args: any[]): any
}

export type ValueOf<T> = T extends ReadonlyArray<any> ? T[number] : T[keyof T]

// export function GitmarsOptionFunctionType(val: string, opts: object, cb: any): void

export type GitmarsBranchType = 'feature' | 'bugfix' | 'support'

export type GitmarsMainBranchType =
    | 'master'
    | 'develop'
    | 'release'
    | 'bugfix'
    | 'support'

// 127和128是git个别场景的执行结果值
export type ShellCode = 0 | 1 | 127 | 128

export type PackageVersionTag =
    | 'alpha'
    | 'lite'
    | 'beta'
    | 'release'
    | 'latest'
    | 'next'

export type GitLogsType = {
    [key in GitLogKeysType]?: string
}

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
    when?(answers: object): void
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
    approve: GitmarsOptionType
}

export interface ModuleCommandType {
    module: string
    entry?: string
    options?: unknown
}

export interface CommandTypeCmd {
    cmd: string | ModuleCommandType
    config: QueueConfigType
}

export interface CommandTypeMessage {
    message: string
}

export type CommandType = CommandTypeCmd | CommandTypeMessage

export interface FetchDataType {
    token: string // gitlab上生成的access_token
    level: 1 | 2 | 3 | 4 // 1=超级管理员 2=管理员 3=审核员 4=开发者
    [prop: string]: any
}

export type GitStatusListType = 'A' | 'D' | 'M' | 'UU' | '??'

export type GitStatusInfoType = {
    [props in GitStatusListType]: string[]
}

export interface QueueConfigType extends SpawnOptions {
    again?: boolean
    processing?: string
    success?: string
    fail?: string
    postmsg?: boolean
    kill?: boolean
}

export interface QueueReturnsType
    extends Partial<
        Pick<SpawnSyncReturns<string>, 'stdout' | 'stderr' | 'status'>
    > {
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
    when?(val: any): string | boolean
    choices?: any
}

export interface RevertCacheType {
    before: GitLogsType
    after: GitLogsType
    branch: string
}
