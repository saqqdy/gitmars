// import { resolve } from 'path'
import type { TaskFunction } from 'gulp'
import { dest, src } from 'gulp'

export function wrapDisplayName<T extends TaskFunction>(
	displayName: string,
	func: T
): TaskFunction {
	return Object.assign(func, { displayName })
}

/**
 * Copy files from one directory to another.
 *
 * @param globs - The source files.
 * @param destDir - The destination directory.
 * @returns task - A function that can be used as a Gulp task.
 */
export function copyTask(globs: string, destDir: string): TaskFunction {
	return function () {
		return src(globs).pipe(dest(destDir))
	}
}

/**
 * Clean files and folders.
 *
 * @param globs - The files and folders to clean.
 * @returns task - A function that can be used as a Gulp task.
 */
// export function cleanTask(globs: string | string[]): TaskFunction {
// 	// return task('cleanStyle', () =>
// 	return src(globs, {
// 		read: false
// 	}).pipe(clean({ force: true, allowEmpty: true }))
// 	// )
// }
