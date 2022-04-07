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

import type { AnyObject } from '../../../typings'
const fs = require('fs')
const path = require('path')
const getGitRevParse = require('../git/getGitRevParse')

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
    const pkgFile = path.resolve(dir, 'package.json')
    const pkgStr = fs.readFileSync(pkgFile, 'utf-8')
    return JSON.parse(pkgStr)
}

module.exports = readPkg
export {}
