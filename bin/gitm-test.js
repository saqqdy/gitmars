#!/usr/bin/env node
const program = require('commander')
const shell = require('shelljs')
const colors = require('colors')
let command = null,
    environment = null

program
    .name('gitm')
    .usage('[command] options')
    .arguments('<cmd> [env]')
    .option('--no-sauce', 'Remove sauce')
    .option(
        '--sa [sa]',
        'Remove sauce',
        (val, pre) => {
            return '--' + val + '--'
        },
        0
    )
    .option('--cheese [flavour]', 'cheese flavour', 'mozzarella')
    .option('--no-cheese', 'plain with no cheese')
    .action((cmd, env, opts) => {
        command = cmd
        environment = env
        console.log('action: ', command, env, opts.sauce, opts.sa, opts.cheese)
    })
program.parse(process.argv)
console.log('args: ', program.args)

if (process.argv.slice(2).length === 0) {
    program.outputHelp(warning)
}

function warning(txt) {
    return colors.red(txt)
}
function success(txt) {
    return colors.green(txt)
}

if (command === null) {
    console.error('no command given!')
    process.exit(1)
}
console.log('command: ', command)
console.log('environment: ', environment || 'no environment given')
