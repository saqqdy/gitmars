import type { Terminal } from 'xterm'

export type TermType = Record<string, any>

export interface TerminalType {
    name: string
    pid?: number
    term?: Terminal
}
