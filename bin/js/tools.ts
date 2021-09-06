import fs from 'fs'
import colors from 'colors'

import type { GitmarsOptionArgsType } from '../../typings'

export function warning(txt: string): string {
    return colors.yellow(txt)
}
export function error(txt: string): string {
    return colors.red(txt)
}
export function success(txt: string): string {
    return colors.green(txt)
}

/**
 * writeFile
 * @description 写文件
 */
export function writeFile(url: string, data: string): Promise<Error | boolean> {
    return new Promise((resolve, reject) => {
        fs.writeFile(url, data, err => {
            if (err) {
                reject(new Error('文件写入错误'))
            } else {
                resolve(true)
            }
        })
    })
}

/**
 * createArgs
 * @description 生成参数
 */
export function createArgs(args: GitmarsOptionArgsType[]): string {
    let argArr: string[] = []
    args.forEach(arg => {
        let str = arg.name
        if (arg.variadic) str += '...'
        if (arg.required) str = '<' + str + '>'
        else str = '[' + str + ']'
        argArr.push(str)
    })
    return argArr.join(' ')
}

export default {
    warning,
    error,
    success,
    writeFile,
    createArgs
}
