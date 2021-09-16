import type { Terminal } from 'xterm'

export interface TermType {
	[prop: string]: any
}

export interface TerminalType {
	name: string
	pid?: number
	term?: Terminal
}
