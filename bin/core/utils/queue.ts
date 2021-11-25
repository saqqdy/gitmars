const sh = require('shelljs')
const ora = require('ora')
const { getCommandCache } = require('../cache/commandCache')
const getCommandMessage = require('../git/getCommandMessage')
const { setLog } = require('../cache/log')
const { error, success, warning } = require('../utils/colors')
const { postMessage } = require('./message')

import type { ShellCode, CommandType, QueueReturnsType } from '../../../typings'

export type WaitCallback = {
    (kill?: boolean): void
}

export type QueueStartFunction = {
    (command?: CommandType | string, cb?: WaitCallback): void
}

/**
 * 递归执行程序
 *
 * @param list - 脚本序列
 * @param func - 执行函数
 */
function wait(list: Array<CommandType | string>, fun: QueueStartFunction) {
    // 最后一条指令，执行完成之后退出递归
    if (list.length === 0) {
        fun()
        return
    } else {
        fun(list[0], (kill = false) => {
            // 强制中断
            if (kill) return
            list.shift()
            wait(list, fun)
        })
    }
}

/**
 * 脚本执行主程序
 *
 * @param list - 脚本序列
 * @returns promise - QueueReturnsType
 */
function queue(list: Array<CommandType | string>): Promise<QueueReturnsType[]> {
    const spinner = ora()
    return new Promise((resolve, reject) => {
        const returns: QueueReturnsType[] = []
        if (list.length === 0) reject('指令名称不能为空')
        list = JSON.parse(JSON.stringify(list))
        wait(list, (command?: CommandType | string, cb?: WaitCallback) => {
            let cfg = {
                    silent: true,
                    postmsg: false,
                    kill: true,
                    again: false // 指令执行中断之后是否需要重新执行，类似冲突解决之后的指令，不再需要重复执行
                } as CommandType['config'],
                cmd = command as string
            // 传入对象形式：{ cmd: '', config: {} }
            if (command instanceof Object) {
                cfg = Object.assign(cfg, command.config || {})
                cmd = command.cmd as string
            }
            if (!cmd) {
                spinner.stop()
                // 只有一条指令，不需返回数组形式
                resolve(returns)
            } else {
                const msg = getCommandMessage(cmd)
                spinner.start(
                    success(cfg.processing || msg.processing || '正在处理')
                )
                sh.exec(cmd, cfg, (code: ShellCode, out: string, err: any) => {
                    try {
                        out = JSON.parse(out)
                    } catch {
                        out = out.replace(/\n*$/g, '')
                    }
                    returns.push({ code, out, err, cfg, cmd })
                    if (code !== 0) setLog({ command, code, out, err })
                    if (code !== 0 && cfg.kill) {
                        // 当前指令执行错误且设置该条指令需要中断，则中断递归
                        const rest = JSON.parse(JSON.stringify(list))
                        if (!cfg.again) {
                            rest.shift()
                        } else if (cfg.again !== true) {
                            rest.splice(0, 1, cfg.again)
                        }
                        cb && cb(true) // 回调并中断执行
                        getCommandCache(rest)
                        // 只有silent模式才需要输出信息
                        cfg.silent && spinner.fail(error(err))
                        spinner.fail(
                            error(
                                cfg.fail ||
                                    msg.fail ||
                                    '出错了！指令 ' +
                                        cmd +
                                        ' 执行失败，中断了进程'
                            )
                        )
                        cfg.postmsg &&
                            postMessage(
                                '出错了！指令 ' + cmd + ' 执行失败，中断了进程'
                            )
                        rest.length > 0 &&
                            spinner.fail(
                                error('请处理相关问题之后输入gitm continue继续')
                            )
                        sh.exit(1)
                    } else {
                        if (code === 0) {
                            const _message = cfg.success || msg.success
                            if (_message) {
                                spinner.succeed(success(_message))
                                cfg.postmsg && postMessage(_message)
                            }
                        } else {
                            const m =
                                cfg.fail ||
                                msg.fail ||
                                '指令 ' + cmd + ' 执行失败'
                            m && spinner.warn(warning(m))
                        }
                        cb && cb() // 回调，继续执行下一条
                    }
                })
            }
        })
    })
}

module.exports = {
    wait,
    queue
}
export {}
