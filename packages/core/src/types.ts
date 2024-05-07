import type { SpawnOptions, SpawnSyncReturns } from 'child_process'

export type ValueOf<T> = T extends ReadonlyArray<any> ? T[number] : T[keyof T]

// export function GitmarsOptionFunctionType(val: string, opts: object, cb: any): void

export type GitmarsBranchType = 'feature' | 'bugfix' | 'support'

export type VersionControlType = 'patch' | 'minor' | 'major' | false

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

export interface QueueReturnsType
	extends Partial<Pick<SpawnSyncReturns<string>, 'stdout' | 'stderr' | 'status'>> {
	cfg: QueueConfigType
	cmd: string | string[] | ModuleCommandType
}

export interface CommandMessageType {
	processing?: string
	success?: string
	fail?: string
}
