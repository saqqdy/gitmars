export type AnyObject = Record<string, any>

export interface AnyFunction extends AnyObject {
	(...args: any[]): any
}

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

export interface TranslatePair {
	[key: string]: string | string[] | TranslatePair
}
export interface Language extends Record<string, string | TranslatePair> {
	name: string
	// base?: TranslatePair
}
