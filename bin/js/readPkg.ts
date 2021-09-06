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

import gitRevParse from './gitRevParse'
import fs from 'fs'
import path from 'path'

/**
 * getConfig
 * @description 读取配置
 * @returns {Object} arr 返回配置对象
 */
function readPkg(dir) {
    if (!dir) {
        let { root } = gitRevParse()
        dir = root
    }
    const pkgFile = path.resolve(dir, 'package.json')
    const pkgStr = fs.readFileSync(pkgFile, 'utf-8')
    return JSON.parse(pkgStr)
}
export default readPkg
