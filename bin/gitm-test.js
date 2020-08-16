#!/usr/bin/env node
const { program1, Command, createCommand } = require('commander')
const sh = require('shelljs')
const { queue } = require('./js/index')
// const program1 = createCommand('aaaaaaa')
// program1.option('-k, --key [keyword]', '3333333333333333333333', null)
class MyCommand extends Command {
	createCommand(name) {
		const cmd = new MyCommand(name)
		cmd.option('-d,--debug', 'output options')
		return cmd
	}
}

const program = new MyCommand()
program.option('--port <port-number>', 'specify port number', 80).action(cmd => {
	if (cmd.debug) {
		console.log('Options:')
		console.log(cmd.opts())
	}
})

program.parse()
