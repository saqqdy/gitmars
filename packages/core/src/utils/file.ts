import fs from 'fs'
import sh from 'shelljs'
import ora from 'ora'
import { green } from 'colors'

sh.config.silent = true

export interface GitmarsCacheFileDescriptionType {
    name?: string
    url: string
}

/**
 * 写文件
 */
export function writeFile(url: string, data: string): Promise<Error | boolean> {
    return new Promise((resolve, reject) => {
        fs.writeFile(url, data, (err: any) => {
            if (err) {
                reject(new Error('文件写入错误'))
            } else {
                resolve(true)
            }
        })
    })
}

/**
 * 同步写入文件
 */
export function writeFileSync(url: string, data: string, options?: any): void {
    fs.writeFileSync(url, data, {
        mode: 0o0755,
        ...options
    })
}

/**
 * 判断文件是否存在
 *
 * @param filePath - 完整文件路径
 * @returns isFileExist - 返回是否
 */
export function isFileExist(filePath: string): boolean {
    // 这里使用find是为了兼容路径里面带了通配符
    return sh.test('-f', filePath) || sh.find(filePath).stdout !== ''
}

/**
 * 移除文件
 *
 * @param files - 需要清理的文件数组，类型GitmarsCacheFileDescriptionType
 */
export function removeFile(
    files: GitmarsCacheFileDescriptionType | GitmarsCacheFileDescriptionType[]
) {
    const spinner = ora()
    if (!Array.isArray(files)) files = [files]
    for (const file of files) {
        file.name && spinner.start(green(`正在处理${file.name}`))
        const fileExist = isFileExist(file.url)
        if (fileExist) {
            sh.rm(file.url)
            file.name && spinner.succeed(green(`${file.name}已删除`))
        } else {
            file.name && spinner.warn(green(`${file.name}未找到`))
        }
    }
    spinner.stop()
    sh.echo(green('清理完毕'))
}

export default {
    writeFile,
    writeFileSync,
    isFileExist,
    removeFile
}
