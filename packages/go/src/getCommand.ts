import type { GitmarsOptionType } from './types'
import inquirer from 'inquirer'
import createPrompt from './createPrompt'

export interface CommandNeedInput {
	required: boolean
	name: string
	variadic: boolean
	defaultValue: any
	description: string
}

/**
 * Run the interactive prompt
 *
 * @public
 * @param config - Configuration
 * @returns result - A promise resolving to the command result
 */
async function getCommand({
	command,
	args,
	options,
	validatorOpts,
	validatorArgs,
	transformOpts,
	transformArgs,
}: GitmarsOptionType) {
	let params: string[] = [],
		needInput: CommandNeedInput[] = [] // List of options requiring input

	// Step 1: args options
	if (options.length > 0) {
		// Skip step 1 (checkbox) when either every option requires a value or every option is recommend: true
		const needStep1 = options.some(
			option => (!option.optional && !option.required) || !option.recommend,
		)

		if (needStep1) {
			const answer1 = await inquirer.prompt(
				createPrompt(
					command,
					{
						options,
						validator: validatorOpts,
						transform: transformOpts,
					},
					'checkbox',
				),
			)
			const { [command]: selection } = answer1

			selection.forEach((prop: string) => {
				const option = options.find(opt => opt.long === prop)

				if (option && (option.optional || option.required)) {
					// Required <> or optional []
					needInput.push({
						required: option.required,
						name: option.long,
						variadic: false,
						defaultValue: option.defaultValue,
						description: option.description,
					})
				} else {
					params.push(prop)
				}
			})
		} else {
			needInput = options.map(option => {
				return {
					required: option.required,
					name: option.long,
					variadic: false,
					defaultValue: option.defaultValue,
					description: option.description,
				}
			})
		}
	}
	// Step 2: command options
	if (args.length > 0) {
		const answer2 = await inquirer.prompt(
			createPrompt(
				command,
				{
					options: args,
					validator: validatorArgs,
					transform: transformArgs,
				},
				'input',
			),
		)

		params = (Object.values(answer2) as string[]).concat(params)
	}
	// Step 3: args options that require a value
	if (needInput.length > 0) {
		const answer3 = await inquirer.prompt(
			createPrompt(command, { options: needInput }, 'input'),
		)
		const arr = Object.entries(answer3).map((item: any[]) => {
			if (item[1] !== '') item[1] = `"${item[1]}"`

			return item
		})

		params = params.concat(arr.flat(Infinity))
	}

	return Promise.resolve(`${params.join(' ').replace(/\s+/g, ' ').trim()}`)
}

export default getCommand
