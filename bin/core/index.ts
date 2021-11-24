const sh = require('shelljs')
const ora = require('ora')
const { success, warning, error, isFileExist } = require('./utils/index')
const { getGitConfig, getGitRevParse, getGitStatus } = require('./git/index')
const getConfig = require('./getConfig')

import type {
    AnyFunction,
    AnyObject,
    ShellCode,
    CommandType,
    QueueReturnsType,
    GitmarsBranchType
} from '../../typings'

export interface CommandMessageType {
    processing: string
    success: string
    fail: string
}

export type SendMessageType = {
    silent: boolean
}

export type WaitCallback = {
    (kill?: boolean): void
}

export type QueueStartFunction = {
    (command?: CommandType | string, cb?: WaitCallback): void
}

/**
 * mapTemplate
 * @description 获取模板数据
 */
export function mapTemplate(
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

/**
 * wait
 * @description 递归执行程序
 */
export function wait(
    list: Array<CommandType | string>,
    fun: QueueStartFunction
) {
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
 * queue
 * @description 脚本执行主程序
 * @param {Array} list 脚本序列
 */
export function queue(
    list: Array<CommandType | string>
): Promise<QueueReturnsType[]> {
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
                        setCache(rest)
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

/**
 * getCache
 * @description 获取未执行脚本列表
 * @returns {Array} arr 返回数组
 */
export function getCache() {
    const { gitDir } = getGitRevParse()
    let arr = []
    if (isFileExist(gitDir + '/.gitmarscommands')) {
        arr = sh
            .cat(gitDir + '/.gitmarscommands')
            .stdout.split('\n')[0]
            .replace(/(^\n*)|(\n*$)/g, '')
            .replace(/\n{2,}/g, '\n')
            .replace(/\r/g, '')
        arr = JSON.parse(decodeURIComponent(arr))
    }
    return arr
}

/**
 * setCache
 * @description 存储未执行脚本列表
 */
export function setCache(rest: Array<CommandType | string>): void {
    const { gitDir } = getGitRevParse()
    sh.touch(gitDir + '/.gitmarscommands')
    // eslint-disable-next-line no-control-regex
    sh.sed(
        '-i',
        /[\s\S\n\r\x0a\x0d]*/,
        encodeURIComponent(JSON.stringify(rest)),
        gitDir + '/.gitmarscommands'
    )
}

/**
 * 清除队列缓存
 */
export function cleanCache(): void {
    setCache([])
}

/**
 * setLog
 * @description 存储错误日志
 */
export function setLog(log: object): void {
    const { gitDir } = getGitRevParse()
    sh.touch(gitDir + '/.gitmarslog')
    // eslint-disable-next-line no-control-regex
    sh.sed(
        '-i',
        /[\s\S\n\r\x0a\x0d]*/,
        encodeURIComponent(JSON.stringify(log)),
        gitDir + '/.gitmarslog'
    )
}

/**
 * getStatus
 * @description 获取是否有未提交的文件
 * @returns {Boolean} true 返回true/false
 */
export function getStatus(): boolean {
    const sum = getGitStatus({ silent: false })
    if (sum.A.length > 0 || sum.D.length > 0 || sum.M.length > 0) {
        sh.echo(
            error('您还有未提交的文件，请处理后再继续') +
                '\n如果需要暂存文件请执行: gitm save\n恢复时执行：gitm get'
        )
        sh.exit(1)
        return false
    } else if (sum['??'].length > 0) {
        sh.echo(
            warning('您有未加入版本的文件,') +
                '\n如果需要暂存文件请执行: gitm save --force\n恢复时执行：gitm get'
        )
    }
    return true
}

/**
 * checkBranch
 * @description 获取是否有某个分支
 * @returns {Boolean} true 返回true/false
 */
export async function checkBranch(name: string): Promise<string> {
    const data = await queue([`gitm branch -k ${name}`])
    return data[0].out.replace(/^\s+/, '')
}
// export function checkBranch(name) {
// 	return queue([`gitm branch -k ${name}`]).then(data => {
// 		return resolve(data[0].out.replace(/^\s+/, ''))
// 	})
// }

/**
 * searchBranch
 * @description 获取当前分支
 * @returns array 返回列表数组
 */
export async function searchBranch(
    key: string,
    type: GitmarsBranchType,
    remote = false
): Promise<string[]> {
    const data = (
        await queue([
            `gitm branch${key ? ' -k ' + key : ''}${type ? ' -t ' + type : ''}${
                remote ? ' -r' : ''
            }`
        ])
    )[0].out.replace(/^\*\s+/, '')
    let arr = data ? data.split('\n') : []
    arr = arr.map(el => el.trim())
    return arr
}

/**
 * filterBranch
 * @description 搜索分支
 * @returns {Array} 返回列表数组
 */
export function filterBranch(
    key: string,
    types: string,
    remote = false
): string[] {
    let typesList: string[] = [types],
        list: string[]
    if (typeof types === 'string') typesList = types.split(',')
    const out = sh
        .exec(`git branch${remote ? ' -a' : ''}`, { silent: true })
        .stdout.replace(/(^\s+|[\n\r]*$)/g, '') // 去除首尾
        .replace(/\*\s+/, '') // 去除*
    list = out ? out.replace(/\n(\s+)/g, '\n').split('\n') : []
    list = list.filter(el => {
        let result = true
        // 匹配关键词
        if (key && !el.includes(key)) result = false
        // 匹配类型
        if (result && typesList.length > 0) {
            result = false
            type: for (const type of typesList) {
                if (el.includes(type)) {
                    result = true
                    break type
                }
            }
        }
        return result
    })
    return list
}

/**
 * getStashList -------------------------------------------
 * @description 获取暂存区列表
 * @returns {String} 返回名称
 */

export async function getStashList(key: string) {
    const data = (await queue(['git stash list']))[0].out.replace(/^\*\s+/, '')
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
    } catch (e) {
        //
    }
    return arr
}

/**
 * getMessage
 * @description 解析模板数据
 */
export function getMessage(type: string): string {
    const { root } = getGitRevParse()
    const { appName } = getGitConfig()
    const config = getConfig()
    const d = new Date()
    let str = ''
    switch (type) {
        case 'time':
            str = d.toLocaleString()
            break
        case 'timeNum':
            str = String(d.getTime())
            break
        case 'pwd':
            str = root
            break
        case 'project':
            str = appName
            break
        case 'user':
            str = config.user
            break

        default:
            break
    }
    return str
}

/**
 * postMessage
 * @description 生成消息
 */
export function postMessage(msg = ''): void {
    const config = getConfig()
    if (!config.msgTemplate) {
        sh.echo(error('请配置消息发送api模板地址'))
        return
    }
    const message = mapTemplate(config.msgTemplate, key => {
        if (key === 'message') return msg
        return getMessage(key)
    })
    config.msgUrl && message && sendMessage(message)
}

/**
 * sendMessage
 * @description 发送消息
 */
export function sendMessage(message = '', cfg = {} as SendMessageType): void {
    const config = getConfig()
    const { silent = true } = cfg
    if (!config.msgUrl) {
        sh.echo(error('请配置消息推送地址'))
        return
    }
    message = message.replace(/\s/g, '')
    config.msgUrl &&
        sh.exec(
            `curl -i -H "Content-Type: application/json" -X POST -d '{"envParams":{"error_msg":"'${message}'"}}' "${config.msgUrl}"`,
            { silent }
        )
}

/**
 * getCommandMessage
 * @description 获取通用的指令提示信息
 */
export function getCommandMessage(cmd: string): CommandMessageType {
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



