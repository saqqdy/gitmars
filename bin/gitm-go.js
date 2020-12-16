#!/usr/bin/env node
const program = require('commander')
const fs = require('fs')
const sh = require('shelljs')
const { options, args } = require('./conf/build')
const { queue, success, warning, getCurrent, getLogs, compareVersion } = require('./js/index')
const getConfig = require('./js/getConfig')
const global = require('./js/global')
const { pwd, gitDir, gitHookDir } = require('./js/global')

/**
 * gitm go
 */
program
	.name('gitm go')
	.usage('[command]')
	.description('智能猜测你要执行的动作')
	.arguments('[command]')
	// .option('--no-verify', '是否需要跳过校验权限', false)
	// .option('-s, --since [since]', '查询在某个时间之后的日志，填写格式：10s/2m/2h/3d/4M/5y', '7d')
	// .option('-l, --limit [limit]', '最多查询的日志条数')
	// .option('-b, --branches [branches]', '要查询的分支')
	.action(async (command, opt) => {
		const config = getConfig()
		const mainBranchs = [config.master, config.develop, config.release, config.support, config.bugfix]
		const current = getCurrent()
		const branchPrefix = current.split('/')[0]
		let prompts = []
		sh.echo(success(`当前分支${current}，系统猜测你可能想做以下操作：`))
		console.log(branchPrefix)
		if (mainBranchs.includes(current)) {
			// 主干分支
			/**
			 * 1. gitm start/combine/end 开发分支
			 * 2. gitm admin publish 发布
			 * 3. gitm branch 分支操作
			 * 4. gitm build 构建
			 */
		} else if (branchPrefix === 'feature') {
			// feature
			/**
			 * 1. gitm start/combine/end 开发分支
			 * 2. gitm admin publish 发布
			 * 3. gitm branch 分支操作
			 * 4. gitm build 构建
			 */
			// var directionsPrompt = {
			// 	type: 'list',
			// 	name: 'direction',
			// 	message: 'Which direction would you like to go?',
			// 	choices: ['Forward', 'Right', 'Left', 'Back']
			// }
			// function main() {
			// 	console.log('You find youself in a small room, there is a door in front of you.')
			// 	exitHouse()
			// }
			// function exitHouse() {
			// 	inquirer.prompt(directionsPrompt).then(answers => {
			// 		if (answers.direction === 'Forward') {
			// 			console.log('You find yourself in a forest')
			// 			console.log('There is a wolf in front of you; a friendly looking dwarf to the right and an impasse to the left.')
			// 			encounter1()
			// 		} else {
			// 			console.log('You cannot go that way. Try again')
			// 			exitHouse()
			// 		}
			// 	})
			// }
			// function encounter1() {
			// 	inquirer.prompt(directionsPrompt).then(answers => {
			// 		var direction = answers.direction
			// 		if (direction === 'Forward') {
			// 			console.log('You attempt to fight the wolf')
			// 			console.log('Theres a stick and some stones lying around you could use as a weapon')
			// 			encounter2b()
			// 		} else if (direction === 'Right') {
			// 			console.log('You befriend the dwarf')
			// 			console.log('He helps you kill the wolf. You can now move forward')
			// 			encounter2a()
			// 		} else {
			// 			console.log('You cannot go that way')
			// 			encounter1()
			// 		}
			// 	})
			// }
			// function encounter2a() {
			// 	inquirer.prompt(directionsPrompt).then(answers => {
			// 		var direction = answers.direction
			// 		if (direction === 'Forward') {
			// 			var output = 'You find a painted wooden sign that says:'
			// 			output += ' \n'
			// 			output += ' ____  _____  ____  _____ \n'
			// 			output += '(_  _)(  _  )(  _ \\(  _  ) \n'
			// 			output += '  )(   )(_)(  )(_) ))(_)(  \n'
			// 			output += ' (__) (_____)(____/(_____) \n'
			// 			console.log(output)
			// 		} else {
			// 			console.log('You cannot go that way')
			// 			encounter2a()
			// 		}
			// 	})
			// }
			// function encounter2b() {
			// 	inquirer
			// 		.prompt({
			// 			type: 'list',
			// 			name: 'weapon',
			// 			message: 'Pick one',
			// 			choices: ['Use the stick', 'Grab a large rock', 'Try and make a run for it', 'Attack the wolf unarmed']
			// 		})
			// 		.then(() => {
			// 			console.log('The wolf mauls you. You die. The end.')
			// 		})
			// }
			// main()

			// inquirer
			// 	.prompt([
			// 		{
			// 			type: 'checkbox',
			// 			message: '请选择你需要的类型',
			// 			name: 'toppings',
			// 			choices: [
			// 				new inquirer.Separator(' = 肉类 = '),
			// 				{
			// 					name: 'Pepperoni',
			// 					disabled: '不可选'
			// 				},
			// 				{
			// 					name: 'Ham',
			// 					checked: true
			// 				},
			// 				{
			// 					name: 'Ground Meat'
			// 				},
			// 				new inquirer.Separator(' = 蔬菜 = '),
			// 				{
			// 					name: 'Mozzarella'
			// 				},
			// 				{
			// 					name: 'Cheddar'
			// 				},
			// 				{
			// 					name: 'Parmesan'
			// 				},
			// 				new inquirer.Separator(' = 酒水饮料 ='),
			// 				{
			// 					name: 'Mushroom'
			// 				},
			// 				{
			// 					name: 'Tomato'
			// 				}
			// 			],
			// 			validate(answer) {
			// 				if (answer.length < 1) {
			// 					return 'You must choose at least one topping.'
			// 				}
			// 				return true
			// 			}
			// 		}
			// 	])
			// 	.then(answers => {
			// 		console.log(JSON.stringify(answers, null, '  '))
			// 	})
			// inquirer
			// 	.prompt([
			// 		{
			// 			type: 'list',
			// 			name: 'theme',
			// 			message: 'What do you want to do?',
			// 			choices: [
			// 				'Order a pizza',
			// 				'Make a reservation',
			// 				new inquirer.Separator(),
			// 				'Ask for opening hours',
			// 				{
			// 					name: 'Contact support',
			// 					disabled: 'Unavailable at this time'
			// 				},
			// 				'Talk to the receptionist'
			// 			]
			// 		},
			// 		{
			// 			type: 'list',
			// 			name: 'size',
			// 			message: 'What size do you need?',
			// 			choices: ['Jumbo', 'Large', 'Standard', 'Medium', 'Small', 'Micro'],
			// 			filter: function (val) {
			// 				return val.toLowerCase()
			// 			}
			// 		}
			// 	])
			// 	.then(answers => {
			// 		console.log(JSON.stringify(answers, null, '  '))
			// 	})
		} else if (branchPrefix === 'bugfix') {
			// bugfix
		} else if (branchPrefix === 'support') {
			// support
		}
	})
program.parse(process.argv)
