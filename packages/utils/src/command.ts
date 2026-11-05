import type { GitmarsOptionArgsType } from './types'

/**
 * Build command arguments
 *
 * @param args - GitmarsOptionArgs
 * @returns options - Parameters
 */
export function createArgs(args: GitmarsOptionArgsType[]): string {
	const argArr: string[] = []

	args.forEach(arg => {
		let str = arg.name

		if (arg.variadic) str += '...'
		if (arg.required) str = `<${str}>`
		else str = `[${str}]`
		argArr.push(str)
	})

	return argArr.join(' ')
}
