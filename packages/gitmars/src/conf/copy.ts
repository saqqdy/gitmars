import type { GitmarsOptionType } from '../../typings/gitmars'
// import lang from '#lib/common/local'
const t = (txt: string) => txt

export const cmdConfig: GitmarsOptionType = {
	command: 'copy',
	short: 'cp',
	args: [
		{
			required: false,
			name: 'commitid',
			variadic: true,
			validator: (val, opts, cb) => {
				cb()
			},
			// transformer: null,
			description: t('Commit record ID')
		}
	],
	options: [
		{
			flags: '--lastet [lastet]',
			required: false,
			optional: true,
			variadic: false,
			mandatory: false,
			short: '',
			long: '--lastet',
			negate: false,
			description: t(
				'Query logs after a certain time, fill in the format: 10s/2m/2h/3d/4M/5y'
			),
			defaultValue: ''
		},
		{
			flags: '--no-merges',
			required: false,
			optional: false,
			variadic: false,
			mandatory: false,
			long: '--no-merges',
			negate: true,
			description: t('Whether to exclude merge records'),
			defaultValue: true,
			recommend: false
		},
		{
			flags: '--limit [limit]',
			required: false,
			optional: true,
			variadic: false,
			mandatory: false,
			short: '',
			long: '--limit',
			negate: false,
			description: t('The maximum number of logs to be queried'),
			defaultValue: ''
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
