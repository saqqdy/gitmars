import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { join, sep } from 'node:path'
import { awaitTo as to } from 'js-cool'
import { version } from '../package.json'
import { packages } from '../build/packages'

const [, , ...args] = process.argv
const IS_TEST = args.includes('--test')
const IS_DRY_RUN = args.includes('--dry-run')

export const ROOT = join(__dirname, '..')
export const PACKAGE = join(ROOT, 'packages')

const REGISTRY_URL = 'https://registry.npmjs.org'
let command = `pnpm publish --registry=${REGISTRY_URL} --access public --no-git-checks`

if (IS_DRY_RUN) command += ' --dry-run'

if (version.includes('rc')) command += ' --tag release'
else if (version.includes('beta')) command += ' --tag beta'
else if (version.includes('alpha')) command += ' --tag alpha'
else if (IS_TEST) {
	console.warn(`${version} is not a test version, process exited`)
	process.exit(0)
}

(async () => {
	for await (const { name } of packages) {
		const dirName = name.replace(/\./g, sep)
		const cwd = name === 'monorepo' ? ROOT : join(PACKAGE, dirName)

		to(
			promisify(exec)(command, {
				cwd,
				timeout: 30000,
			}),
		).then(([err]: any) => {
			err && console.error(err.stderr!)
		})
	}
})()
