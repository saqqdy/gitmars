import type { GitmarsOptionType } from './types'

export interface GoCleanConfigType {
	// Delete option
	delOptions?: string[]
	// Required option
	requiredOptions?: string[]
	// Delete argument
	delArgs?: string[]
	// Required argument
	requiredArgs?: string[]
}

/**
 * Clean up options
 *
 * @public
 * @param config - Configuration
 * @param sets - Cleanup settings
 * @returns result - config
 */
function cleanConfigSet(
	config: GitmarsOptionType,
	sets: GoCleanConfigType = {},
): GitmarsOptionType {
	const { delOptions = [], requiredOptions = [], delArgs = [], requiredArgs = [] } = sets

	if (delOptions.length) {
		let len = config.options.length

		while (len--) {
			if (delOptions.includes(config.options[len].long)) {
				config.options.splice(len, 1)
			}
		}
	}
	if (delArgs.length) {
		let len = config.args.length

		while (len--) {
			if (delArgs.includes(config.args[len].name)) {
				config.args.splice(len, 1)
			}
		}
	}
	if (requiredOptions.length) {
		let len = config.options.length

		while (len--) {
			if (requiredOptions.includes(config.options[len].long)) {
				config.options[len].required = true
			}
		}
	}
	if (requiredArgs.length) {
		let len = config.args.length

		while (len--) {
			if (requiredArgs.includes(config.args[len].name)) {
				config.args[len].required = true
			}
		}
	}

	return config
}

export default cleanConfigSet
