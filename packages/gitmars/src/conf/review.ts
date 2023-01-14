import type { GitmarsOptionType } from '../../typings'
// import lang from '#lib/common/local'
const t = (txt: string) => txt

export const cmdConfig: GitmarsOptionType = {
	command: 'review',
	short: 'ap',
	args: [],
	options: [
		{
			flags: '--state [state]',
			required: false,
			optional: true,
			variadic: false,
			mandatory: false,
			short: '',
			long: '--state',
			negate: false,
			description: t(
				'Filter merge request status, there are 2 types: opened, closed, not passed then default all'
			),
			defaultValue: 'opened',
			options: ['opened', 'closed', 'merged', 'all'],
			value: 'opened'
		},
		{
			flags: '--quiet',
			required: false,
			optional: false,
			variadic: false,
			mandatory: false,
			short: '',
			long: '--quiet',
			negate: false,
			description: t('Do not push the message'),
			defaultValue: false
		}
	],
	// validator opts
	validatorOpts: (val, opts, cb) => {
		cb()
	},
	// validator args
	validatorArgs: (val, opts, cb) => {
		cb()
	},
	// transform opts
	transformOpts: (val, opts, cb) => {
		cb()
	},
	// transform args
	transformArgs: (val, opts, cb) => {
		cb()
	}
}

export { cmdConfig as default }
