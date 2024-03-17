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
	command: string
	short?: string | null
	args: GitmarsOptionArgsType[]
	options: GitmarsOptionOptionsType[]
	validatorOpts?(val: any, opts: object, cb: Function): void
	validatorArgs?(val: any, opts: object, cb: Function): void
	transformOpts?(val: any, opts: object, cb: Function): void
	transformArgs?(val: any, opts: object, cb: Function): void
}
