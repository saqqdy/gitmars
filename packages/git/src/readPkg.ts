// let getImportDefault = (this && this.getImportDefault) || (mod => (mod && mod.__esModule ? mod : { default: mod }))
// Object.defineProperty(exports, '__esModule', { value: true })

// const fs = getImportDefault(require('fs'))
// const path = getImportDefault(require('path'))
// function readPkg(dir) {
// 	const pkgFile = path.default.resolve(dir, 'package.json')
// 	const pkgStr = fs.default.readFileSync(pkgFile, 'utf-8')
// 	return JSON.parse(pkgStr)
// }
// export const readPkg = readPkg

import type { AnyObject } from './types'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import getGitRevParse from './getGitRevParse'

/**
 * 读取配置
 *
 * @param dir - 项目目录
 * @returns config - package.json
 */
function readPkg(dir?: string): AnyObject {
	if (!dir) {
		const { root } = getGitRevParse()

		dir = root
	}
	const pkgFile = resolve(dir, 'package.json')
	const pkgStr = readFileSync(pkgFile, 'utf-8')

	return JSON.parse(pkgStr)
}

export default readPkg
