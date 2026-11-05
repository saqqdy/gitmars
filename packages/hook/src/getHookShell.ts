import fs from 'node:fs'
import { resolve } from 'node:path'
import { readPkg } from '@gitmars/git'
import getHookComment from './getHookComment'
import { SH_PATH } from './paths'

/**
 * Generate the hook entry script
 *
 * @returns shell - The generated hook shell script
 */
function getHookShell(): string {
	const pkg = readPkg()
	const hookShell = fs
		.readFileSync(resolve(SH_PATH, 'gitmars.sh'), 'utf-8')
		.replace('gitmarsVersion="0.0.0"', `gitmarsVersion="${pkg.version}"`)

	return [getHookComment(), '', hookShell].join('\n')
}

export default getHookShell
