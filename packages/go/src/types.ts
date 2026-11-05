export type AnyObject = Record<string, any>

export interface AnyFunction extends AnyObject {
	(...args: any[]): any
}

export interface GitmarsOptionArgsType {
	required: boolean
	name: string
	variadic: boolean
	validator?: (val: string, opts: object, cb: AnyFunction) => void
	transformer?: (val: string, answers: object, flags: object, options: GitmarsOptionArgsType) => void
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
	validator?: (val: string, opts: object, cb: AnyFunction) => void
	transformer?: (
		val: string,
		answers: object,
		flags: object,
		options: GitmarsOptionOptionsType,
	) => void
	when?: (answers: object) => void
}

export interface GitmarsOptionType {
	// Command name
	command: string
	// short command
	short?: string | null
	// Command arguments
	args: GitmarsOptionArgsType[]
	// Arguments passed to the command
	options: GitmarsOptionOptionsType[]
	// Validation options
	validatorOpts?: (val: any, opts: object, cb: AnyFunction) => void
	// Arguments passed to validation
	validatorArgs?: (val: any, opts: object, cb: AnyFunction) => void
	// Argument value transform
	transformOpts?: (val: any, opts: object, cb: AnyFunction) => void
	// Passed value transform
	transformArgs?: (val: any, opts: object, cb: AnyFunction) => void
}
