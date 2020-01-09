#!/usr/bin/env node
const set = require('./../package.json');
const program = require('commander');
const shell = require('shelljs');
const log = require('tracer').colorConsole();
if (!shell.which('git')) {
	shell.echo('Sorry, this script requires git');
	shell.exit(1);
}

program
	.version('v' + set.version)
	.option('-m, --merge', 'Add peppers')
	.option('-r, --release', 'Add pineapple')
	.option('-, --bbq-sauce', 'Add bbq sauce')
	.option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'release')
	.parse(process.argv);

let pwd = shell.pwd() + '';
console.log(pwd)
console.log('你输入了以下指令:');
if (program.peppers) console.log('  - peppers');
if (program.pineapple) console.log('  - pineapple'); // shell.touch('2.js');shell.cp('2.js', '1.js');
if (program.bbqSauce) console.log('  - bbq');
console.log('  - %s', program.cheese);