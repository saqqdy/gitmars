/**
 * 中文转unicode
 *
 * @param str - 字符串
 * @returns code - 返回字符串
 */
export function encodeUnicode(str: string): string {
    const res = []
    for (let i = 0; i < str.length; i++) {
        res[i] = ('00' + str.charCodeAt(i).toString(16)).slice(-4)
    }
    return '\\u' + res.join('\\u')
}

/**
 * 中文转unicode
 *
 * @param str - 字符串
 * @returns code - 返回字符串
 */
export function decodeUnicode(str: string): string {
    str = str.replace(/\\/g, '%')
    return unescape(str)
}

export default {
    encodeUnicode,
    decodeUnicode
}
