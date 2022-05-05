import type { CommandMessageType } from '../../typings'

/**
 * 获取通用的指令提示信息
 *
 * @param cmd - 指令
 * @returns commandMessage - 指令提示信息
 */
function getCommandMessage(cmd: string): CommandMessageType {
    const msg = {} as CommandMessageType
    const arr = cmd.replace(/[\s]+/g, ' ').split(' ')
    if (arr.length < 2 || arr[0] !== 'git') return msg
    switch (arr[1]) {
        case 'checkout':
            msg.processing = '正在切换分支'
            msg.success = '切换分支成功'
            msg.fail = '切换分支失败'
            break
        case 'pull':
            msg.processing = '正在拉取代码'
            msg.success = '拉取代码成功'
            msg.fail = '拉取代码失败'
            break
        case 'fetch':
            msg.processing = '正在拉取远程版本'
            msg.success = '抓取成功'
            msg.fail = '抓取失败'
            break
        case 'commit':
            msg.processing = '正在提交'
            msg.success = '提交成功'
            msg.fail = '提交失败'
            break
        case 'push':
            msg.processing = '正在推送'
            msg.success = '推送成功'
            msg.fail = '推送失败'
            break
        case 'cherry-pick':
            msg.processing = '正在同步提交记录'
            msg.success = '同步提交记录成功'
            msg.fail = '同步提交记录失败'
            break
        case 'merge':
            msg.processing = '正在merge分支'
            msg.success = 'merge分支成功'
            msg.fail = 'merge分支失败'
            break
        case 'rebase':
            msg.processing = '正在rebase分支'
            msg.success = 'rebase分支成功'
            msg.fail = 'rebase分支失败'
            break
        case 'revert':
            msg.processing = '正在回撤代码'
            msg.success = '撤销成功'
            msg.fail = '撤销失败'
            break
        case 'clean':
            msg.processing = '正在清理'
            msg.success = '清理成功'
            msg.fail = '清理失败'
            break

        default:
            break
    }
    return msg
}

export default getCommandMessage
