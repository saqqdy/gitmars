export interface GitmarsOptionArgsType {
	required: boolean
	name: string
	variadic: boolean
	validator?(val: string, opts: object, cb: Function): void
	transformer?(val: string, answers: object, flags: object, options: GitmarsOptionArgsType): void
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
	// 指令名称
	command: string
	// short command
	short?: string | null
	// 指令参数
	args: GitmarsOptionArgsType[]
	// 指令传参
	options: GitmarsOptionOptionsType[]
	// 校验参数
	validatorOpts?(val: any, opts: object, cb: Function): void
	// 校验传参
	validatorArgs?(val: any, opts: object, cb: Function): void
	// 参数值转换
	transformOpts?(val: any, opts: object, cb: Function): void
	// 传参值转换
	transformArgs?(val: any, opts: object, cb: Function): void
}
