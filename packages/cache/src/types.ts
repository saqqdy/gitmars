import type { SpawnOptions, SpawnSyncReturns } from 'child_process'
import type { GitLogsType } from '@gitmars/git'

export interface ModuleCommandType {
	module: string
	entry?: string
	options?: unknown
}

export interface CommandTypeCmd {
	cmd: string | string[] | ModuleCommandType
	config: QueueConfigType
}

export interface CommandTypeMessage {
	message: string
}

export type CommandType = CommandTypeCmd | CommandTypeMessage

export interface QueueConfigType extends SpawnOptions {
	again?: boolean | string
	processing?: string
	success?: string
	fail?: string
	postmsg?: boolean
	kill?: boolean
}

export interface GitmarsLogType
	extends Partial<Pick<SpawnSyncReturns<string>, 'stdout' | 'stderr' | 'status'>> {
	command: string
}

export interface RevertCacheType {
	before: GitLogsType
	after: GitLogsType
	branch: string
}
