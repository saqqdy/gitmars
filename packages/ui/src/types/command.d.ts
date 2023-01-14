export interface CommandSetsType {
	command: string
	short?: string | null
	args: any[]
	options: any[]
	validatorOpts?(val: any, opts: any, cb: any): void
	validatorArgs?(val: any, opts: any, cb: any): void
	transformOpts?(val: any, opts: any, cb: any): void
	transformArgs?(val: any, opts: any, cb: any): void
}

// export interface CommandMultiSetsType extends CommandSetsType {
// 	[prop: string]: CommandSetsType
// }
