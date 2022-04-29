import type { AnyFunction, AnyObject } from '../../../typings'

/**
 * 获取模板数据
 *
 * @example
 * ```ts
 * const tmp = "${message}；项目：${project}；路径：${pwd}"
 * mapTemplate(tmp, {
 *     message: '运行成功',
 *     project: 'gitmars',
 *     pwd: '/path/to/url'
 * })
 * // 运行成功；项目：gitmars；路径：/path/to/url
 * ```
 * @param tmp - 模板名称
 * @param data - 模板数据
 */
function mapTemplate(
    tmp: string,
    data: AnyFunction | AnyObject
): string | null {
    if (!tmp || !data) return null
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

module.exports = mapTemplate
export {}
