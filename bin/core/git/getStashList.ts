const sh = require('shelljs')
const { warning } = require('../utils/colors')

/**
 * 获取暂存区列表
 *
 * @param key - 名称
 * @returns stashList - 返回stashList
 */
function getStashList(key: string) {
    const data = sh
        .exec('git stash list', { silent: true })
        .stdout.replace(/(^\s+|\n+$)/, '')
    const list: string[] = (data && data.split('\n')) || []
    const arr: {
        key: string
        index: number
        msg: string
    }[] = []
    if (list.length > 10)
        sh.echo(
            warning(`该项目下一共有${list.length}条暂存记录，建议定期清理！`)
        )
    try {
        list.forEach(item => {
            const msgArr: string[] = item.split(':')
            const first = msgArr.shift() as string
            if (!key || (key && key === msgArr[msgArr.length - 1].trim())) {
                const m = first.match(/^stash@\{(\d+)\}$/)
                // 去除不必要的消息
                if (msgArr.length > 1) msgArr.shift()
                arr.push({
                    key: first,
                    index: m ? +m[1] : 0,
                    msg: msgArr.join(':').trim()
                })
            }
        })
    } catch {
        //
    }
    return arr
}

module.exports = getStashList
export {}
