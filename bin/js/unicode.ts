/**
 * encodeUnicode
 * @description 中文转unioncode
 * @param {string} str 字符串
 * @returns {String} 返回字符串
 */
function encodeUnicode(str) {
    let res = []
    for (var i = 0; i < str.length; i++) {
        res[i] = ('00' + str.charCodeAt(i).toString(16)).slice(-4)
    }
    return '\\u' + res.join('\\u')
}

/**
 * decodeUnicode
 * @description 中文转unioncode
 * @param {string} str 字符串
 * @returns {String} 返回字符串
 */
function decodeUnicode(str) {
    str = str.replace(/\\/g, '%')
    return unescape(str)
}

export default {
    encodeUnicode,
    decodeUnicode
}
