import type { SpawnOptions, SpawnSyncOptions, SpawnSyncReturns } from 'node:child_process'
import crossSpawn from 'cross-spawn'
import { debug } from './debug'
import stringify from './stringify'

/**
 * Run a script asynchronously
 *
 * @param client - Name of the script runner
 * @param argv - Parameters
 * @param options - Options forwarded to the caller
 * @returns result - Return execution results
 */
export function spawn(
	client: string,
	argv: string[],
	options: SpawnOptions = {},
): Partial<SpawnSyncReturns<string>> {
	let len = argv.length

	while (len--) {
		!argv[len] && argv.splice(len, 1)
	}
	const program = crossSpawn.sync(
		client,
		argv.map(item => stringify(item)),
		{
			// stdio: 'inherit',
			shell: process.platform === 'win32',
			...options,
		},
	)

	debug('spawn', client, argv)

	return {
		pid: program.pid,
		stdout: program.stdout ? program.stdout.toString().replace(/\s+$/, '') : '',
		stderr: program.stderr ? program.stderr.toString() : '',
		status: program.status,
		signal: program.signal,
		error: program.error,
	}
}

/**
 * Run a script synchronously
 *
 * @param client - Name of the script runner
 * @param argv - Parameters
 * @param options - Options forwarded to the caller
 * @returns result - Return execution results
 */
export function spawnSync(
	client: string,
	argv: string[],
	options: SpawnSyncOptions = {},
): Partial<SpawnSyncReturns<string>> {
	let len = argv.length

	while (len--) {
		!argv[len] && argv.splice(len, 1)
	}
	const program = crossSpawn.sync(
		client,
		argv.map(item => stringify(item)),
		{
			// stdio: 'inherit',
			shell: process.platform === 'win32',
			...options,
		},
	)

	debug('spawnSync', client, argv)

	return {
		pid: program.pid,
		stdout: program.stdout ? program.stdout.toString().replace(/\s+$/, '') : '',
		stderr: program.stderr ? program.stderr.toString() : '',
		status: program.status,
		signal: program.signal,
		error: program.error,
	}
}
