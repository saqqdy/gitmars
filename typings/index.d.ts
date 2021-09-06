export interface GitmarsConfigArgsType {
    required: boolean
    name: string
    variadic: boolean
    validator?(val: string, opts: object, cb: any): void
    transformer?(val: string, opts: object, cb: any): void
    description?: string
}

export interface GitmarsConfigOptionsType {
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

export interface GitmarsConfigType {
    command: string
    short?: string | null
    // args: Array<GitmarsConfigArgsType>
    // options: Array<GitmarsConfigOptionsType>
    args: GitmarsConfigArgsType[]
    options: GitmarsConfigOptionsType[]
    validatorOpts?(val: any, opts: object, cb: Function): void
    validatorArgs?(val: any, opts: object, cb: Function): void
    transformOpts?(val: any, opts: object, cb: Function): void
    transformArgs?(val: any, opts: object, cb: Function): void
}

export interface GitmarsMultiConfigType {
    command: string
    short?: string | null
    create: GitmarsConfigType
    publish: GitmarsConfigType
    update: GitmarsConfigType
    clean: GitmarsConfigType
}
