import fs from 'fs'
import sh from 'shelljs'
import ora from 'ora'
import chalk from 'chalk'
import lang from '#lib/lang'

sh.config.silent = true

const { t } = lang

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
                reject(new Error(t('File write error')))
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
 * Determine if a file exists
 *
 * @param filePath - full file path
 * @returns isFileExist - return true false
 */
export function isFileExist(filePath: string): boolean {
    // The use of find here is for compatibility with paths that have wildcards in them
    return sh.test('-f', filePath) || sh.find(filePath).stdout !== ''
}

/**
 * remove files
 *
 * @param files - Array of files to be cleaned. type: GitmarsCacheFileDescriptionType
 */
export function removeFile(
    files: GitmarsCacheFileDescriptionType | GitmarsCacheFileDescriptionType[]
) {
    const spinner = ora()
    if (!Array.isArray(files)) files = [files]
    for (const file of files) {
        file.name &&
            spinner.start(
                chalk.green(
                    t('Processing: {{{something}}}', {
                        something: file.name
                    })
                )
            )
        const fileExist = isFileExist(file.url)
        if (fileExist) {
            sh.rm(file.url)
            file.name &&
                spinner.succeed(
                    chalk.green(t('{{name}} deleted', { name: file.name }))
                )
        } else {
            file.name &&
                spinner.warn(
                    chalk.green(t('{{name}} not found', { name: file.name }))
                )
        }
    }
    spinner.stop()
    sh.echo(chalk.green(t('Cleaned up')))
}

export default {
    writeFile,
    writeFileSync,
    isFileExist,
    removeFile
}
