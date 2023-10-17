import type { AnyFunction, AnyObject } from '../../typings'

/**
 * Getting template data
 *
 * @example
 * ```ts
 * const tmp = "${message}; project: ${project}; path: ${pwd}"
 * mapTemplate(tmp, {
 *     message: 'Run successfully',
 *     project: 'gitmars',
 *     pwd: '/path/to/url'
 * })
 * // Run successfully; project: gitmars; path: /path/to/url
 * ```
 * @param tmp - Template name
 * @param data - Template data
 */
function mapTemplate(tmp: string, data: AnyFunction | AnyObject): string {
	if (!tmp || !data) throw new Error('"tmp" & "data" is required')
	const str: string =
		'' +
		tmp.replace(/\$\{([a-zA-Z0-9-_]+)\}/g, (a, b) => {
			if (typeof data === 'function') {
				return data(b)
			}
			for (const k in data) {
				if (b === k) {
					return data[k]
				}
			}
		})
	return str
}

export default mapTemplate
