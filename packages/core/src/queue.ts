import ora from 'ora'
import extend from 'js-cool/lib/extend'
import { green, red, yellow } from 'colors'
import type {
    CommandMessageType,
    CommandType,
    QueueReturnsType
} from '../typings'
import { setCommandCache } from './cache/commandCache'
import getCommandMessage from './git/getCommandMessage'
import { setLog } from './cache/log'
import { postMessage } from './utils/message'
import { spawnSync } from './spawn'
import { debug } from './utils/debug'

export interface WaitCallback {
    (kill?: boolean): void
}

export interface QueueStartFunction {
    (command?: CommandType | string, cb?: WaitCallback): void
}

/**
 * 递归执行程序
 *
 * @param list - 脚本序列
 * @param func - 执行函数
 */
export function wait(
    list: Array<CommandType | string>,
    fun: QueueStartFunction
) {
    // 最后一条指令，执行完成之后退出递归
    if (list.length === 0) {
        fun()
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
export function queue(
    list: Array<CommandType | string>
): Promise<QueueReturnsType[]> {
    const spinner = ora()
    // 处理脚本执行成功
    function onSuccess(
        msg: CommandMessageType,
        cfg: CommandType['config'],
        cb?: WaitCallback
    ) {
        const _message = cfg.success || msg.success || '处理完成'
        if (_message) {
            spinner.succeed(green(_message))
            cfg.postmsg && postMessage(_message)
        }
        cb && cb() // 回调，继续执行下一条
    }
    // 处理脚本执行错误
    function onError(
        list: Array<CommandType | string>,
        cmd: CommandType['cmd'],
        err: any,
        msg: CommandMessageType,
        cfg: CommandType['config'],
        cb?: WaitCallback
    ) {
        if (cfg.kill) {
            // 当前指令执行错误且设置该条指令需要中断，则中断递归
            cb && cb(true) // 回调并中断执行
            const rest = extend(true, [], list) as unknown as Array<CommandType | string>
            if (!cfg.again) {
                rest.shift()
            } else if (cfg.again !== true) {
                rest.splice(0, 1, cfg.again)
            }
            setCommandCache(rest)
            // 只有silent模式才需要输出信息
            if (
                !cfg.stdio ||
                (typeof cfg.stdio === 'string' &&
                    ['ignore'].includes(cfg.stdio))
            ) {
                spinner.fail(red(err))
            }
            spinner.fail(
                red(
                    cfg.fail ||
                        msg.fail ||
                        '出错了！指令 ' + cmd + ' 执行失败，中断了进程'
                )
            )
            cfg.postmsg &&
                postMessage('出错了！指令 ' + cmd + ' 执行失败，中断了进程')
            rest.length > 0 &&
                spinner.fail(red('请处理相关问题之后输入gitm continue继续'))
            process.exit(1)
        } else {
            const _message = cfg.fail || msg.fail || '指令 ' + cmd + ' 执行失败'
            _message && spinner.warn(yellow(_message))
            cb && cb() // 回调，继续执行下一条
        }
    }
    return new Promise((resolve, reject) => {
        const returns: QueueReturnsType[] = []
        if (list.length === 0) reject(new Error('指令名称不能为空'))
        list = extend(true, [], list) as unknown as Array<CommandType | string>
        wait(
            list,
            async (command?: CommandType | string, cb?: WaitCallback) => {
                let cfg = {
                        stdio: 'ignore',
                        postmsg: false,
                        kill: true,
                        again: false // 指令执行中断之后是否需要重新执行，类似冲突解决之后的指令，不再需要重复执行
                    } as CommandType['config'],
                    cmd: CommandType['cmd']
                // 传入对象形式：{ cmd: '', config: {} }
                if (command instanceof Object) {
                    cfg = Object.assign(cfg, command.config || {})
                    cmd = command.cmd
                } else {
                    cmd = command!
                }
                if (!cmd) {
                    spinner.stop()
                    // 只有一条指令，不需返回数组形式
                    resolve(returns)
                } else if (typeof cmd === 'object') {
                    // 传入function类型，取到需要执行的函数
                    let status = 0,
                        stdout,
                        stderr,
                        _execFunction = require(cmd.module)
                    if (cmd.entry) _execFunction = _execFunction[cmd.entry]
                    try {
                        spinner.start(green(cfg.processing || '正在处理'))
                        stdout = await _execFunction(cmd.options)
                        debug('queue-result', cmd, stdout)
                        onSuccess({} as CommandMessageType, cfg, cb)
                    } catch (err: any) {
                        // 请求出错
                        status = 1
                        stderr = err
                        onError(
                            list,
                            cmd,
                            err,
                            {} as CommandMessageType,
                            cfg,
                            cb
                        )
                    }
                    returns.push({
                        status,
                        stdout,
                        stderr,
                        cfg,
                        cmd
                    })
                } else {
                    const [client, ...argv] = cmd
                        .replace(/\s+/g, ' ')
                        .split(' ')
                    // cmd是字符串
                    const msg = getCommandMessage(cmd)
                    spinner.start(
                        green(cfg.processing || msg.processing || '正在处理')
                    )
                    const program = spawnSync(client, argv, cfg)
                    const { status, stderr } = program
                    let { stdout } = program
                    debug('queue-result', cmd, stdout)
                    try {
                        stdout = JSON.parse(stdout!)
                    } catch {
                        //
                    }
                    returns.push({
                        status,
                        stdout,
                        stderr,
                        cfg,
                        cmd
                    })
                    if (status !== 0) {
                        setLog({
                            command: command as string,
                            status,
                            stdout,
                            stderr
                        })
                    }
                    if (status !== 0) {
                        onError(list, cmd, stderr, msg, cfg, cb)
                    } else {
                        // status === 0 执行成功
                        onSuccess(msg, cfg, cb)
                    }
                }
            }
        )
    })
}

export default {
    wait,
    queue
}
