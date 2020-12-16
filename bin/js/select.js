/* eslint-disable */
'use strict'
var inquirer = require('inquirer')
// console.log(inquirer, process.cwd(), __dirname)

// ------------------------------------------------------------------------------------------------------
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

// ------------------------------------------------------------------------------------------------------
// var questions = [
// 	{
// 		type: 'editor',
// 		name: 'bio',
// 		message: 'Please write a short bio of at least 3 lines.',
// 		validate: function (text) {
// 			if (text.split('\n').length < 3) {
// 				return 'Must be at least 3 lines.'
// 			}

// 			return true
// 		}
// 	}
// ]

// inquirer.prompt(questions).then(answers => {
// 	console.log(JSON.stringify(answers, null, '  '))
// })

// ------------------------------------------------------------------------------------------------------
// inquirer
// 	.prompt([
// 		{
// 			type: 'expand',
// 			message: 'Conflict on `file.js`: ',
// 			name: 'overwrite',
// 			choices: [
// 				{
// 					key: 'y',
// 					name: 'Overwrite',
// 					value: 'overwrite'
// 				},
// 				{
// 					key: 'a',
// 					name: 'Overwrite this one and all next',
// 					value: 'overwrite_all'
// 				},
// 				{
// 					key: 'd',
// 					name: 'Show diff',
// 					value: 'diff'
// 				},
// 				new inquirer.Separator(),
// 				{
// 					key: 'x',
// 					name: 'Abort',
// 					value: 'abort'
// 				}
// 			]
// 		}
// 	])
// 	.then(answers => {
// 		console.log(JSON.stringify(answers, null, '  '))
// 	})

// ------------------------------------------------------------------------------------------------------
var directionsPrompt = {
	type: 'list',
	name: 'direction',
	message: 'Which direction would you like to go?',
	choices: ['Forward', 'Right', 'Left', 'Back']
}
function main() {
	console.log('You find youself in a small room, there is a door in front of you.')
	exitHouse()
}
function exitHouse() {
	inquirer.prompt(directionsPrompt).then(answers => {
		if (answers.direction === 'Forward') {
			console.log('You find yourself in a forest')
			console.log('There is a wolf in front of you; a friendly looking dwarf to the right and an impasse to the left.')
			encounter1()
		} else {
			console.log('You cannot go that way. Try again')
			exitHouse()
		}
	})
}
function encounter1() {
	inquirer.prompt(directionsPrompt).then(answers => {
		var direction = answers.direction
		if (direction === 'Forward') {
			console.log('You attempt to fight the wolf')
			console.log('Theres a stick and some stones lying around you could use as a weapon')
			encounter2b()
		} else if (direction === 'Right') {
			console.log('You befriend the dwarf')
			console.log('He helps you kill the wolf. You can now move forward')
			encounter2a()
		} else {
			console.log('You cannot go that way')
			encounter1()
		}
	})
}
function encounter2a() {
	inquirer.prompt(directionsPrompt).then(answers => {
		var direction = answers.direction
		if (direction === 'Forward') {
			var output = 'You find a painted wooden sign that says:'
			output += ' \n'
			output += ' ____  _____  ____  _____ \n'
			output += '(_  _)(  _  )(  _ \\(  _  ) \n'
			output += '  )(   )(_)(  )(_) ))(_)(  \n'
			output += ' (__) (_____)(____/(_____) \n'
			console.log(output)
		} else {
			console.log('You cannot go that way')
			encounter2a()
		}
	})
}
function encounter2b() {
	inquirer
		.prompt({
			type: 'list',
			name: 'weapon',
			message: 'Pick one',
			choices: ['Use the stick', 'Grab a large rock', 'Try and make a run for it', 'Attack the wolf unarmed']
		})
		.then(() => {
			console.log('The wolf mauls you. You die. The end.')
		})
}
main()

// ------------------------------------------------------------------------------------------------------
// var chalkPipe = require('chalk-pipe')
// var questions = [
// 	{
// 		type: 'input',
// 		name: 'first_name',
// 		message: "What's your first name"
// 	},
// 	{
// 		type: 'input',
// 		name: 'last_name',
// 		message: "What's your last name",
// 		default: function () {
// 			return 'Doe'
// 		}
// 	},
// 	{
// 		type: 'input',
// 		name: 'fav_color',
// 		message: "What's your favorite color",
// 		transformer: function (color, answers, flags) {
// 			const text = chalkPipe(color)(color)
// 			if (flags.isFinal) {
// 				return text + '!'
// 			}

// 			return text
// 		}
// 	},
// 	{
// 		type: 'input',
// 		name: 'phone',
// 		message: "What's your phone number",
// 		validate: function (value) {
// 			var pass = value.match(/^([01]{1})?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i)
// 			if (pass) {
// 				return true
// 			}

// 			return 'Please enter a valid phone number'
// 		}
// 	}
// ]

// inquirer.prompt(questions).then(answers => {
// 	console.log(JSON.stringify(answers, null, '  '))
// })

// ------------------------------------------------------------------------------------------------------
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

// ------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------
