/// <reference types="node" />

import type { SpawnOptions, SpawnSyncReturns } from 'child_process'

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

export type GitLogKeysType =
    | '%H'
    | '%h'
    | '%T'
    | '%t'
    | '%P'
    | '%p'
    | '%an'
    | '%aN'
    | '%ae'
    | '%aE'
    | '%al'
    | '%aL'
    | '%ad'
    | '%aD'
    | '%ar'
    | '%at'
    | '%ai'
    | '%aI'
    | '%as'
    | '%cn'
    | '%cN'
    | '%ce'
    | '%cE'
    | '%cl'
    | '%cL'
    | '%cd'
    | '%cD'
    | '%cr'
    | '%ct'
    | '%ci'
    | '%cI'
    | '%cs'
    | '%d'
    | '%D'
    // %(describe[:options]), // human-readable name, like git-describe[1]; empty string for undescribable commits. The describe string may be followed by a colon and zero or more comma-separated options. Descriptions can be inconsistent when tags are added or removed at the same time.
    | '%S' // ref name given on the command line by which the commit was reached (like git log --source), only works with git log
    | '%e' // encoding
    // ----------
    | '%s' // subject
    | '%f' // sanitized subject line, suitable for a filename
    | '%b' // body
    | '%B' // raw body (unwrapped subject and body)
    | '%N' // commit notes
    | '%GG' // raw verification message from GPG for a signed commit
    | '%G?' // show "G" for a good (valid) signature, "B" for a bad signature, "U" for a good signature with unknown validity, "X" for a good signature that has expired, "Y" for a good signature made by an expired key, "R" for a good signature made by a revoked key, "E" if the signature cannot be checked (e.g. missing key) and "N" for no signature
    | '%GS' // show the name of the signer for a signed commit
    | '%GK' // show the key used to sign a signed commit
    | '%GF' // show the fingerprint of the key used to sign a signed commit
    | '%GP' // show the fingerprint of the primary key whose subkey was used to sign a signed commit
    | '%GT' // show the trust level for the key used to sign a signed commit
    | '%gD' // reflog selector, e.g., refs/stash@{1} or refs/stash@{2 minutes ago}; the format follows the rules described for the -g option. The portion before the @ is the refname as given on the command line (so git log -g refs/heads/master would yield refs/heads/master@{0}).
    | '%gd' // shortened reflog selector; same as %gD, but the refname portion is shortened for human readability (so refs/heads/master becomes just master).
    | '%gn' // reflog identity name
    | '%gN' // reflog identity name (respecting .mailmap, see git-shortlog[1] or git-blame[1])
    | '%ge' // reflog identity email
    | '%gE' // reflog identity email (respecting .mailmap, see git-shortlog[1] or git-blame[1])
    | '%gs' // reflog subject
    | '%(trailers:key=Signed-off-by)'
    | '%(trailers:key=Reviewed-by)' // display the trailers of the body as interpreted by git-interpret-trailers[1]. The trailers string may be followed by a colon and zero or more comma-separated options. If any option is provided multiple times the last occurrence wins.

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

export interface GitmarsConfigApisBuildConfigType {
    url: string
    method?: 'post' | 'get' | 'put' | 'delete'
    params?: {
        [key: string]: string | number | boolean | null
    }
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
    apis?: {
        [key: string]: GitmarsConfigApisBuildConfigType
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

export interface GitmarsLogType
    extends Partial<
    Pick<SpawnSyncReturns<string>, 'stdout' | 'stderr' | 'status'>
    > {
    command: string
}

export interface CommandMessageType {
    processing: string
    success: string
    fail: string
}

export interface RevertCacheType {
    before: GitLogsType
    after: GitLogsType
    branch: string
}
