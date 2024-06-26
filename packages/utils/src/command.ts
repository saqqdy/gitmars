import type { GitmarsOptionArgsType } from './types'

/**
 * 生成参数
 *
 * @param args - GitmarsOptionArgs
 * @return options - Parameters
 */
export function createArgs(args: GitmarsOptionArgsType[]): string {
	const argArr: string[] = []
	args.forEach(arg => {
		let str = arg.name
		if (arg.variadic) str += '...'
		if (arg.required) str = '<' + str + '>'
		else str = '[' + str + ']'
		argArr.push(str)
	})
	return argArr.join(' ')
}
