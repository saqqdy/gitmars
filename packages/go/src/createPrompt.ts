import type { GitmarsOptionArgsType, GitmarsOptionOptionsType } from './types'
import chalk from 'chalk'
import lang from './lang'

const { t } = lang

export interface PromptConfigType {
	// Configuration options
	options: GitmarsOptionArgsType[] | GitmarsOptionOptionsType[]
	// Validator
	validator?: (val: string, opts: object, cb: any) => void
	// Value transform
	transform?: (val: string, opts: object, cb: any) => void
}

export interface PromptOptionCheckboxChoicesType {
	name: string
	value: string
	checked: boolean
}

export interface PromptOptionCheckboxType {
	name: string
	type: string
	message: string
	choices: PromptOptionCheckboxChoicesType[]
	validate: (answer: any) => string | boolean
}

export interface PromptOptionInputType {
	name: string
	type: string
	message: string
	transformer?: (val: any, answers: any, flags: any) => any
	validate: (answer: any) => string | boolean
	defaultValue?: any
}

/**
 * Create prompt options
 *
 * @param command - Command name
 * @param config - Configuration
 * @param type - One of checkbox/input/list
 * @returns prompt - The prompt object
 */
function createPrompt(
	command: string,
	{ options, validator, transform: _transform }: PromptConfigType,
	type: string,
) {
	if (type === 'checkbox') {
		if (!options.length) return null
		const promptOpt: PromptOptionCheckboxType = {
			type,
			message: t('Please select'),
			name: command,
			choices: [],
			validate: answer => {
				if (validator) {
					let msg: string | boolean = true

					validator(answer, options, (err: Error) => {
						if (err) msg = err.message
					})

					return msg
				}

				return true
			},
		}

		;(options as GitmarsOptionOptionsType[]).forEach(option => {
			promptOpt.choices.push({
				name: option.description || '',
				value: option.long,
				checked: option.recommend || false,
			})
		})

		return promptOpt as any
	} else if (type === 'input') {
		const list: PromptOptionInputType[] = []

		;(options as GitmarsOptionArgsType[]).forEach(
			({ validator: childValidator, transformer, ...opts }) => {
				// Prefer the validator defined on each option
				if (childValidator) validator = childValidator
				const cfg: PromptOptionInputType = {
					type: 'input',
					name: opts.name,
					message: `${
						opts.description ||
						t('Enter the value of parameter {option}', {
							option: opts.name,
						})
					}${
						!opts.required ? chalk.yellow(
							t('(' + 'Not required{tips}' + ')', {
								tips:
											'defaultValue' in opts && opts.defaultValue !== '' ? `, ${
													t('default "{defaultValue}"', {
														defaultValue: opts.defaultValue,
													})}` : '',
							}),
						) : ''
					}`,
					transformer: (val: string, answers: object, flags: any) => {
						if (!transformer) {
							return val
						} else if (transformer instanceof Function) {
							return transformer(val, answers, flags, opts)
						}
					},
					validate: (val): string | boolean => {
						let msg: string | boolean = true

						if (!val && opts.required) {
							msg = t('Please fill in') + opts.description
						}
						validator &&
						msg === true &&
						validator(val, opts, (err: Error) => {
							if (err) msg = err.message
						})

						return msg
					},
				}

				if ('defaultValue' in opts && opts.defaultValue !== '') {
					cfg.defaultValue = opts.defaultValue
				}
				list.push(cfg)
			},
		)

		return list as any
	}
}

export default createPrompt
