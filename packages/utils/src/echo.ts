import { format } from 'node:util'

/**
 * Print a formatted message to stdout
 *
 * @param message - Message to print
 * @returns void
 */
function echo(message: string): void {
	let output = format(message)

	output += '\n'
	process.stdout.write(output)
}

export default echo
