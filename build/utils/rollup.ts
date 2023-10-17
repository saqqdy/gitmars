import { resolve } from 'path'
import chalk from 'chalk'
// import findWorkspacePackages from '@pnpm/find-workspace-packages'
import { PACKAGE } from './paths'

const noWlPrefixFile =
	/(utils|styles|style|directives|plugins|filters|images|hooks|locale|directives)/

export function generateExternal(
	{ name, input, isFull = false }: { name: string; input: string; isFull?: boolean },
	externals: string[] = []
) {
	const { dependencies = {}, devDependencies = {}, peerDependencies = {} } = require(
		resolve(PACKAGE, name, 'package.json')
	)
	return (id: string) => {
		const pkgs: string[] = Object.keys(peerDependencies)
		if (!isFull) {
			pkgs.push(...Object.keys(dependencies), ...Object.keys(devDependencies))
		}
		return [...new Set(pkgs)].some(
			pkg =>
				id === pkg ||
				id.startsWith(`${pkg}/`) ||
				(id !== input && id.includes(`packages/${name}`)) ||
				externals.includes(id)
		)
		// return (
		//     id.includes('node_modules') ||
		//     (id.includes('gitmars') && id !== input)
		// )
	}
}

export function pathRewriter(bundlePath: string) {
	return (id: string) => {
		if (/^gitmars\/packages/.test(id)) {
			if (noWlPrefixFile.test(id)) {
				return id.replace('gitmars/packages/', bundlePath)
			}
			return id.replace('gitmars/packages/', bundlePath)
		}
		if (/^@\//.test(id)) {
			return id.replace(/^@/, bundlePath)
		}
	}
}

export const reporter = (opt: any, outputOptions: any, info: any) =>
	`${chalk.cyan(
		chalk.bold((info.fileName && `${outputOptions.file?.split('packages/').pop()}`) || '')
	)}: bundle size ${chalk.yellow(info.bundleSize)} -> minified ${chalk.green(
		(info.minSize && `${info.minSize}`) || ''
	)}`

export const excludeFiles = (files: string[]) => {
	const excludes = ['node_modules', 'test', 'mock', 'gulpfile', 'dist']
	return files.filter(path => !excludes.some(exclude => path.includes(exclude)))
}
