export interface TerminalInjection {
	getTerminal(...args: any[]): any
	fitAddon: {
		dispose(...args: any[]): any
	}
}

export interface SocketInjection {
	socket: any
	socketGitmars: any
}
