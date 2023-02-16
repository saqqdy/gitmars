import { createRequire } from 'node:module'
import ora from 'ora'
import extend from 'js-cool/es/extend'
import chalk from 'chalk'
import type { CommandMessageType, CommandType, CommandTypeCmd, QueueReturnsType } from '../typings'
import { setCommandCache } from '#lib/cache/commandCache'
import getCommandMessage from '#lib/git/getCommandMessage'
import { setLog } from '#lib/cache/log'
import { postMessage } from '#lib/utils/message'
import { spawnSync } from '#lib/spawn'
import { debug } from '#lib/utils/debug'
import lang from '#lib/lang'

const { t } = lang
const require = createRequire(import.meta.url)

export interface WaitCallback {
	(kill?: boolean): void
}

export interface QueueStartFunction {
	(command?: CommandType | string | string[] | string[], cb?: WaitCallback): void
}

/**
 * Recursive execution of programs
 *
 * @param list - Script Sequence
 * @param func - Execute function
 */
export function wait(
	list: Array<CommandType | string | string[] | string[]>,
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
export function queue(list: Array<CommandType | string | string[]>): Promise<QueueReturnsType[]> {
	const spinner = ora()
	// 处理脚本执行成功
	function onSuccess(msg: CommandMessageType, cfg: CommandTypeCmd['config'], cb?: WaitCallback) {
		const _message = cfg.success || msg.success || t('Processing complete')
		if (_message) {
			spinner.succeed(chalk.green(_message))
			cfg.postmsg && postMessage(_message)
		}
		cb && cb() // Callback, continue with the next line
	}
	// Handling script execution errors
	function onError(
		list: Array<CommandType | string | string[]>,
		cmd: CommandTypeCmd['cmd'],
		err: any,
		msg: CommandMessageType,
		cfg: CommandTypeCmd['config'],
		cb?: WaitCallback
	) {
		if (cfg.kill) {
			// If the current instruction is executed with an error and setting up the instruction requires an interrupt, the interrupt recursion
			cb && cb(true) // Callback and interrupt execution
			const rest = extend(true, [], list) as unknown as Array<CommandType | string | string[]>
			if (!cfg.again) {
				rest.shift()
			} else if (cfg.again !== true) {
				rest.splice(0, 1, cfg.again)
			}
			setCommandCache(rest)
			// Only silent mode requires output messages
			if (!cfg.stdio || (typeof cfg.stdio === 'string' && ['ignore'].includes(cfg.stdio))) {
				spinner.fail(chalk.red(err))
			}
			spinner.fail(
				chalk.red(
					cfg.fail ||
						msg.fail ||
						t(
							'An error has occurred! Command {{{command}}} execution failed, process exits',
							{
								command: cmd as string
							}
						)
				)
			)
			cfg.postmsg &&
				postMessage(
					t(
						'An error has occurred! Command {{{command}}} execution failed, process exits',
						{
							command: cmd as string
						}
					)
				)
			rest.length > 0 &&
				spinner.fail(
					chalk.red(
						t(
							'Please enter gitm continue to continue after processing the issue in question'
						)
					)
				)
			process.exit(1)
		} else {
			const _message =
				cfg.fail ||
				msg.fail ||
				t('Command {{{command}}} Execution failed', {
					command: cmd as string
				})
			_message && spinner.warn(chalk.yellow(_message))
			cb && cb() // 回调，继续执行下一条
		}
	}
	return new Promise((resolve, reject) => {
		const returns: QueueReturnsType[] = []
		if (list.length === 0) reject(new Error(t('Command name cannot be empty')))
		list = extend(true, [], list) as unknown as Array<CommandType | string | string[]>
		wait(list, async (command?: CommandType | string | string[], cb?: WaitCallback) => {
			let cfg: CommandTypeCmd['config'] = {
					stdio: 'ignore',
					postmsg: false,
					kill: true,
					again: false // Whether the instruction execution needs to be re-executed after interruption, similar to the instruction after conflict resolution, no longer need to repeat the execution
				},
				cmd,
				message
			// Incoming objects: { cmd: '', config: {} }
			if (command instanceof Object) {
				if ('message' in command) {
					// message优先，输出消息
					message = command.message
				} else {
					cfg = Object.assign(cfg, command.config || {})
					cmd = command.cmd
				}
			} else {
				cmd = command!
			}
			/**
			 * Three scenarios
			 *
			 * 1. { message: t('Message') }
			 * 2. { cmd: 'git status', config: {} }
			 * 3. { cmd: { module: '', entry: '', options: {} }, config: {} }
			 */
			if (message) {
				spinner.start(chalk.green(message))
				returns.push({
					status: 0,
					stdout: '',
					stderr: '',
					cfg,
					cmd: ''
				})
				onSuccess(
					{
						success: message
					},
					cfg,
					cb
				)
			} else if (!cmd) {
				spinner.stop()
				// Only one instruction, no need to return array
				resolve(returns)
			} else if (cmd instanceof Array || typeof cmd === 'string') {
				const [client, ...argv] =
					cmd instanceof Array ? cmd : cmd.replace(/\s+/g, ' ').split(' ')
				// cmd is a string
				const msg = getCommandMessage(cmd)
				spinner.start(chalk.green(cfg.processing || msg.processing || t('Processing')))
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
					// status === 0 Execution success
					onSuccess(msg, cfg, cb)
				}
			} else {
				// Pass in the function type and fetch the function to be executed
				let status = 0,
					stdout,
					stderr,
					_execFunction = require(cmd.module)
				if (cmd.entry) _execFunction = _execFunction[cmd.entry]
				try {
					spinner.start(chalk.green(cfg.processing || t('Processing')))
					stdout = await _execFunction(cmd.options)
					debug('queue-result', cmd, stdout)
					onSuccess({} as CommandMessageType, cfg, cb)
				} catch (err: any) {
					// Request error
					status = 1
					stderr = err
					onError(list, cmd, err, {} as CommandMessageType, cfg, cb)
				}
				returns.push({
					status,
					stdout,
					stderr,
					cfg,
					cmd
				})
			}
		})
	})
}

export default {
	wait,
	queue
}
