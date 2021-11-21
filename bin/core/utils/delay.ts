/**
 * 延迟执行
 *
 * @param millisecond - 毫秒
 * @returns {String} 返回字符串
 */
function delay(millisecond: number = 0): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, millisecond)
    })
}

module.exports = delay
export {}
